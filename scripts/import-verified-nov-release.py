#!/usr/bin/env python3
"""Verify and safely stage the approved AQ2 -> 1.18.0 source in a git worktree.

Default is read-only; --apply writes the verified files but never commits/pushes.
"""
import argparse
import hashlib
import json
import pathlib
import subprocess
import sys
import zipfile

SOURCE_HASH = "bd2b4f048568398587432d3ace796767d4e2910ee6e6f3559801c7c938f50dd7"
CANDIDATE_HASH = "f191c11ea811876f5026a41c2fd8686538baef8d3daefdd6e27a990ff7ffe0c2"
PREFIX = "sites-p0-phase-a-20260926/"
BRANCH = "release/nov2026-content-v1.18.0"
QA_PATCHES = ["content-density-wave6-audio.cjs", "current-curriculum-audio-readiness.cjs", "listening-audio-manifest-coverage.cjs", "pronunciation-audio-wave5.cjs"]
QA_PATCH_HASHES = ["808b3d3458f86830b374c10ae85b1426e532e158d5227124731c82894e7fdf04", "ad3ca6e92cb9df1bde5050fc83e74d2536b370ca412eb19c3cc237648b6e3afc", "e11b43e0e73a06c49c7705a521db5dc469a78c9aa01f4d5565b47c8b1e45f3d9", "ddbecf51a54b9d7d4e0dfbcbe71e3e3ba3b5a57bf7d68e0ca83c790864d0091e"]
PROTECTED = PREFIX + "tests/nov-2026-content-preflight.cjs"

def checksum(b):
    return hashlib.sha256(b).hexdigest()

def getfiles(z):
    ret = {}
    for info in z.infolist():
        name = info.filename
        parts = pathlib.PurePosixPath(name).parts
        if name.startswith("/") or ".." in parts or "\\" in name or not name.startswith(PREFIX):
            if name.startswith(PREFIX) or ".." in parts or name.startswith("/"):
                raise ValueError("Unsafe ZIP path: " + name)
            continue
        if info.is_dir():
            continue
        if name in ret:
            raise ValueError("Duplicate file: " + name)
        if any(p in parts for p in ("node_modules", ".git", ".next", ".sites-runtime", "dist")):
            continue
        if pathlib.PurePosixPath(name).name.startswith(".env"):
            raise ValueError("Refusing to import environment secrets: " + name)
        ret[name] = z.read(info)
    return ret

def verify(a,b):
    p1="sites-p0-phase-a-20260926/content/curriculum-1.17.0-candidate.json"
    p2="sites-p0-phase-a-20260926/content/curriculum-1.18.0-candidate.json"
    old=json.loads(a[p1]); new=json.loads(b[p2]); lessons=new["lessons"]
    assert len(old["lessons"])==100 and len(lessons)==109
    assert sum(len(x["activities"]) for x in old["lessons"])==850
    assert sum(len(x["activities"]) for x in lessons)==913
    assert old["lessons"]==lessons[:100], "1.17 lessons changed"
    assert len(lessons[100:])==9
    assert sum(len(x["activities"]) for x in lessons[100:])==63
    added=sorted(b.keys()-a.keys())
    modified=sorted(k for k in a.keys()&b.keys() if a[k]!=b[k])
    removed=sorted(a.keys()-b.keys())
    assert len(removed)==0, "Source files deleted"
    assert len(added)==27 and len(modified)==5, (len(added),len(modified))
    new_audio=[p for p in added if p.endswith('.mp3')]
    assert len(new_audio)==24, len(new_audio)
    for f in new_audio:
        assert len(b[f])>1000 and (b[f][:3] == b'ID3' or b[f][:2] in (b'\xff\xfb',b'\xff\xf3',b'\xff\xf2')), f
    return {"old_lessons":100,"new_lessons":109,"activities":913,"new_audio":24,
            "added":added,"modified":modified,"removed":removed}

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument('--source',type=pathlib.Path,required=True)
    ap.add_argument('--candidate',type=pathlib.Path,required=True)
    ap.add_argument('--repo',type=pathlib.Path)
    ap.add_argument('--qa-patches',type=pathlib.Path,
                    help='Optional directory with four audited legacy QA patches')
    ap.add_argument('--apply',action='store_true')
    args=ap.parse_args()
    for file,expected in ((args.source,SOURCE_HASH),(args.candidate,CANDIDATE_HASH)):
        actual=checksum(file.read_bytes())
        assert actual==expected, f'Incorrect source ZIP: {file.name} {actual}'
    with zipfile.ZipFile(args.source) as z1, zipfile.ZipFile(args.candidate) as z2:
        a,b=getfiles(z1),getfiles(z2)
    report=verify(a,b)
    patches={}
    if args.qa_patches:
        for name,expected in zip(QA_PATCHES,QA_PATCH_HASHES):
            p=args.qa_patches/name
            assert p.is_file(), f'Missing QA patch: {p}'
            assert checksum(p.read_bytes())==expected, f'Unexpected QA patch: {p}'
            patches[PREFIX+'tests/'+name]=p.read_bytes()
        print('Audited local QA patches available: 4')
    print(json.dumps({"phase":"verified","add":len(report['added']),"modified":len(report['modified']),
                      "newMP3":report['new_audio'],"totalLessons":109,"totalActivities":913,"qaPatches":len(patches)},indent=2))
    if not args.apply:
        print('DRY_RUN: No repository files changed. Use --apply with a release git worktree.')
        return
    assert args.repo and args.qa_patches, '--repo and --qa-patches required with --apply'
    repo=args.repo.resolve()
    assert (repo/'.git').exists(), f'Not a git checkout: {repo}'
    branch=subprocess.check_output(['git','-C',str(repo),'branch','--show-current'],text=True).strip()
    assert branch==BRANCH, f'Unexpected git branch {branch}'
    status=subprocess.check_output(['git','-C',str(repo),'status','--porcelain'],text=True)
    assert not status.strip(), 'Git worktree must be clean before import'
    # Do not overwrite a divergent source snapshot without a full reconciliation.
    for name,data in b.items():
        dest=(repo/name).resolve()
        assert dest.is_relative_to(repo), 'Unsafe destination'
        if dest.exists() and dest.read_bytes()!=data and name!=PROTECTED:
            if name not in a or dest.read_bytes()!=a[name]:
                raise RuntimeError('Divergent git working file: '+name)
    for name,data in {**b,**patches}.items():
        if name==PROTECTED and (repo/name).is_file():
            print('PRESERVE: existing release preflight gate')
            continue
        dest=(repo/name).resolve()
        dest.parent.mkdir(parents=True,exist_ok=True)
        dest.write_bytes(data)
    print('STAGED_TO_WORKTREE: source imported, no git add/commit/push/deploy executed')

if __name__=='__main__':
    try: main()
    except (AssertionError,ValueError,RuntimeError) as e:
        print('IMPORT_REFUSED:',e,file=sys.stderr)
        sys.exit(1)
