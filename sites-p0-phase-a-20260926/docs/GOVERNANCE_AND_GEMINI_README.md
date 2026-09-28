# G Learning — Governance and Gemini Handoff Index (v1.0)
Status: DRAFT. These documents are proposed at this branch; they do not modify Site, D1, learner data or accepted curriculum.

Read in this order:
1. [Master Plan](MASTER_PLAN_G_LEARNING_V1.md): durable mission, architecture, seven-domain pedagogy and phased roadmap.
2. [Permanent Rules](PROJECT_RULES_G_LEARNING_V1.md): production/data safeguards, source versioning, academic/QA gates.
3. [Dated Status](PROJECT_STATUS_20260928.md): volatile PR heads, CI issue, production/staging and academic candidate status.
4. [Source Manifest](ACADEMIC_AND_SOURCE_MANIFEST.json): frozen canonical content digests and exact scope.
5. [Gemini Relay Protocol](GEMINI_RELAY_PROTOCOL_V1.md), [one-file bootstrap](GEMINI_CONTEXT_ONE_FILE.md), [self-contained task template](GEMINI_TASK_PACKET_TEMPLATE_V1.json).

**Gemini handoff policy:** one self-contained focused packet per user message. Complete relevant passage/rubric inside THAT file. Never send the whole 45-lesson JSON/ZIP to Gemini and assume complete extraction or cross-chat memory. Distinguish metadata-level coverage advice from independent item semantic QA.

Portable full kit, including frozen baseline/candidate references, a reproducibility check, 14 per-skill metadata packets and a compact strategy packet, is furnished in the owner conversation as a downloadable archive. Those candidate JSON snapshots are NOT committed in this governance PR because 1.5.0 is still REVIEW ONLY. Once approved, update manifest and source refs intentionally; do not silently import or replace content.

Related existing authored standards: [Content Authoring](CONTENT_AUTHORING_STANDARD.md), [Learner Action and Feedback](LEARNER_ACTION_FEEDBACK_STANDARD.md), [Course Architecture v21](COURSE_ARCHITECTURE_V21.md), [v21 QA](COURSE_V21_QA_MATRIX.md). The review-only academic audit/Batch05 plan remains PR #19; v21-P1 code remains PR #21.