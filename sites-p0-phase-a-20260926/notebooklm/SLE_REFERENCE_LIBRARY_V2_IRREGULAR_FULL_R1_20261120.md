# SLE Reference Library v2 — Complete Irregular Verb Corpus, R1 (academic draft)
**Packet ID:** `SLE-REF-IRR-FULL-R1-20261120`  
**Status:** AUTHORING COMPLETE / STRUCTURAL QA ONLY / NOTEBOOKLM ACADEMIC REVIEW PENDING  
**Source of truth:** English SLE-MASTER-001, current `main`, Issue #186; existing 26 pilot entries unchanged.  
**User input:** Common irregular verbs chart as coverage guidance; not copied as an image or textbook text.

## Decision and scope
The previous 15-verb sample was too small for a usable reference library. This corpus expands the actual drafted table to **191 unique base verbs**, preserving six pilot entries in their existing JSON and retaining the 15 previously drafted Wave 1 verb IDs. The other 170 are new candidates. This is a practical common-plus-extended reference, **not every historical, dialectal or archaic irregular English verb**.

This packet supersedes the 15-verb subsection of `SLE_REFERENCE_LIBRARY_V2_WAVE1_R1_20261120.md` as the active irregular-verb review. Its 12 Writing connectors and 11 Frequency entries remain separately pending and will be reviewed after this corpus. Do not select both packets together as concurrent academic sources.

## Prior approved pilot (six entries are REFERENCE ONLY, not rewrites)
| Existing ID | Verb |
| --- | --- |
| REF-IRR-01 | go |
| REF-IRR-02 | see |
| REF-IRR-03 | buy |
| REF-IRR-04 | write |
| REF-IRR-05 | choose |
| REF-IRR-06 | grow |

## Validation contract
- Distinct verb = distinct **base-form lemma**, not an inflated count of tenses or meanings.
- Count and lookup both regular/irregular alternatives for verbs such as `learn`, `burn`, `dream`, `spill`, `smell`, `light`, `get`, `shine`. Distinguish transitive `lay` from intransitive `lie`, ordinary suspended `hang` from execution-specific `hanged`, and `read` spelling from pronunciation.
- Existing approved entries `REF-IRR-01`–`REF-IRR-06` are not to be overwritten, recast or duplicated in the app.
- Every proposed entry gets an ID, base/past/participle, contextual original example, gloss, a note, and core/extended priority. **Core and extended are editor classifications, not CEFR certifications or measured word-frequency ranks.**
- No quiz keys, scores, student work, Gemini calls, Math configuration, Firebase Auth, audio changes or production release.
- All examples below were originally authored for this corpus and require semantic inspection. Cite recognized grammar references only as form-checking leads; do not copy examples from published lists.

## Full candidate table — 185 new/unreviewed entries plus six already-approved references

| ID | Tier | Base | Past simple | Past participle | Short meaning | Original context example |
| --- | --- | --- | --- | --- | --- | --- |
| REF2-IRR-016 | extended | abide | abided / abode | abided / abode | continue or tolerate | They abided by the agreement. |
| REF2-IRR-017 | extended | arise | arose | arisen | appear or begin | A new problem arose during the meeting. |
| REF2-IRR-018 | extended | awake | awoke | awoken | wake from sleep | She awoke when the alarm rang. |
| REF2-IRR-001 | core | be | was / were | been | exist or have a state | The classroom was quiet this morning. |
| REF2-IRR-019 | extended | bear | bore | borne | carry or endure | The bridge has borne heavy traffic for years. |
| REF2-IRR-020 | core | beat | beat | beaten | defeat or strike repeatedly | Our team beat the champions yesterday. |
| REF2-IRR-021 | core | become | became | become | change into a new state | The sky became dark before the storm. |
| REF2-IRR-022 | extended | befall | befell | befallen | happen to someone | A strange accident befell the traveller. |
| REF2-IRR-023 | core | begin | began | begun | start | The science lesson began at nine. |
| REF2-IRR-024 | extended | behold | beheld | beheld | see or observe | The visitors beheld a remarkable view. |
| REF2-IRR-025 | core | bend | bent | bent | curve or fold | He bent the wire into a circle. |
| REF2-IRR-026 | core | bet | bet | bet | risk money on an outcome | She bet that the blue team would win. |
| REF2-IRR-027 | core | bid | bid | bid | offer a price | They bid for the painting online. |
| REF2-IRR-028 | extended | bind | bound | bound | tie or fasten | The students bound the pages together. |
| REF2-IRR-029 | core | bite | bit | bitten | cut with teeth | The puppy bit the rubber toy. |
| REF2-IRR-030 | core | bleed | bled | bled | lose blood | His finger bled after a small cut. |
| REF2-IRR-031 | core | blow | blew | blown | move air | The wind blew the leaves across the path. |
| REF2-IRR-032 | core | break | broke | broken | damage into pieces | She broke the cup by accident. |
| REF2-IRR-033 | extended | breed | bred | bred | produce offspring | The farm bred horses for many years. |
| REF2-IRR-034 | core | bring | brought | brought | carry toward someone | He brought his notebook to class. |
| REF2-IRR-035 | core | broadcast | broadcast | broadcast | transmit on radio or television | The station broadcast the concert live. |
| REF2-IRR-036 | core | build | built | built | construct | They built a small wooden bridge. |
| REF2-IRR-037 | core | burn | burned / burnt | burned / burnt | be damaged by fire or heat | The candle burned for an hour. |
| REF2-IRR-038 | core | burst | burst | burst | break open suddenly | The balloon burst during the game. |
| REF2-IRR-039 | extended | cast | cast | cast | throw or assign a role | The director cast her in the school play. |
| REF2-IRR-040 | core | catch | caught | caught | stop and hold something moving | He caught the ball with both hands. |
| REF2-IRR-041 | extended | cling | clung | clung | hold tightly | The wet towel clung to the railing. |
| REF2-IRR-004 | core | come | came | come | move toward | My aunt came to visit us last week. |
| REF2-IRR-042 | core | cost | cost | cost | have a price | The ticket cost five pounds. |
| REF2-IRR-043 | extended | creep | crept | crept | move slowly and quietly | The cat crept under the sofa. |
| REF2-IRR-044 | core | cut | cut | cut | divide with a sharp tool | She cut the paper into strips. |
| REF2-IRR-045 | extended | deal | dealt | dealt | handle or distribute | He dealt the cards fairly. |
| REF2-IRR-046 | core | dig | dug | dug | make a hole | We dug a small hole for the tree. |
| REF2-IRR-047 | core | dive | dived / dove | dived | jump into water | The swimmer dived into the pool. |
| REF2-IRR-002 | core | do | did | done | perform an action | I did my homework before dinner. |
| REF2-IRR-048 | core | draw | drew | drawn | make a picture | She drew a map of the park. |
| REF2-IRR-049 | core | dream | dreamed / dreamt | dreamed / dreamt | experience dreams | I dreamed about the seaside last night. |
| REF2-IRR-050 | core | drink | drank | drunk | consume a liquid | We drank water after the run. |
| REF2-IRR-051 | core | drive | drove | driven | operate a vehicle | My dad drove us to the museum. |
| REF2-IRR-013 | core | eat | ate | eaten | consume food | They ate lunch in the garden. |
| REF2-IRR-052 | core | fall | fell | fallen | drop downward | A leaf fell onto the table. |
| REF2-IRR-053 | core | feed | fed | fed | give food | We fed the rabbits in the morning. |
| REF2-IRR-054 | core | feel | felt | felt | experience an emotion or sensation | She felt excited about the trip. |
| REF2-IRR-055 | core | fight | fought | fought | struggle or argue | The two brothers fought over the game. |
| REF2-IRR-015 | core | find | found | found | discover | They found a lost key near the gate. |
| REF2-IRR-056 | extended | flee | fled | fled | run away from danger | The villagers fled the rising water. |
| REF2-IRR-057 | extended | fling | flung | flung | throw suddenly | He flung his scarf onto the chair. |
| REF2-IRR-058 | core | fly | flew | flown | move through air | The birds flew over the lake. |
| REF2-IRR-059 | extended | forbid | forbade | forbidden | not allow | The rules forbade eating in the lab. |
| REF2-IRR-060 | extended | forecast | forecast | forecast | predict what will happen | The report forecast heavy rain. |
| REF2-IRR-061 | extended | foresee | foresaw | foreseen | predict | They foresaw problems with the plan. |
| REF2-IRR-062 | core | forget | forgot | forgotten | fail to remember | I forgot my library card yesterday. |
| REF2-IRR-063 | core | forgive | forgave | forgiven | stop blaming | She forgave her friend after the apology. |
| REF2-IRR-064 | extended | forsake | forsook | forsaken | abandon | He forsook his original plan. |
| REF2-IRR-065 | core | freeze | froze | frozen | turn into ice | The water froze overnight. |
| REF2-IRR-066 | core | get | got | got / gotten | receive or become | He got a message from his teacher. |
| REF2-IRR-006 | core | give | gave | given | hand to someone | The teacher gave us a new worksheet. |
| REF2-IRR-067 | extended | grind | ground | ground | crush into small pieces | The machine ground the grain into flour. |
| REF2-IRR-068 | core | hang | hung | hung | suspend from above | We hung the picture beside the window. |
| REF2-IRR-003 | core | have | had | had | possess or experience | They had a short break after lunch. |
| REF2-IRR-069 | core | hear | heard | heard | perceive sound | I heard music from the next room. |
| REF2-IRR-070 | core | hide | hid | hidden | keep out of sight | The child hid behind the curtain. |
| REF2-IRR-071 | core | hit | hit | hit | strike | The ball hit the wall. |
| REF2-IRR-072 | core | hold | held | held | keep in the hand | She held the umbrella over her friend. |
| REF2-IRR-073 | core | hurt | hurt | hurt | cause pain | He hurt his knee during practice. |
| REF2-IRR-074 | extended | input | input / inputted | input / inputted | enter data | The operator input the figures. |
| REF2-IRR-075 | core | keep | kept | kept | continue to have or hold | She kept the letter in a drawer. |
| REF2-IRR-076 | extended | kneel | knelt / kneeled | knelt / kneeled | rest on the knees | He knelt to tie his shoe. |
| REF2-IRR-008 | core | know | knew | known | have knowledge | I knew the answer after the clue. |
| REF2-IRR-077 | core | lay | laid | laid | put something down | She laid the book on the desk. |
| REF2-IRR-078 | core | lead | led | led | guide | Our guide led us through the gallery. |
| REF2-IRR-079 | extended | lean | leaned / leant | leaned / leant | rest at an angle | He leaned against the fence. |
| REF2-IRR-080 | extended | leap | leaped / leapt | leaped / leapt | jump | The deer leapt over the stream. |
| REF2-IRR-081 | core | learn | learned / learnt | learned / learnt | gain knowledge | We learned new words in class. |
| REF2-IRR-082 | core | leave | left | left | go away | The train left at noon. |
| REF2-IRR-083 | core | lend | lent | lent | give temporarily | She lent me her pencil. |
| REF2-IRR-084 | core | let | let | let | allow | Dad let us stay up late. |
| REF2-IRR-085 | core | lie | lay | lain | rest in a horizontal position | The cat lay on the rug all afternoon. |
| REF2-IRR-086 | extended | light | lit / lighted | lit / lighted | make something start burning or shine | She lit a candle on the table. |
| REF2-IRR-087 | core | lose | lost | lost | misplace or fail to win | He lost his ticket on the bus. |
| REF2-IRR-007 | core | make | made | made | create | We made a poster together. |
| REF2-IRR-088 | core | mean | meant | meant | signify or intend | She meant to call you yesterday. |
| REF2-IRR-089 | core | meet | met | met | come together | They met outside the library. |
| REF2-IRR-090 | extended | mislead | misled | misled | give a false idea | The unclear title misled the readers. |
| REF2-IRR-091 | extended | mistake | mistook | mistaken | identify wrongly | I mistook that bag for mine. |
| REF2-IRR-092 | extended | offset | offset | offset | balance an effect | The savings offset the extra cost. |
| REF2-IRR-093 | extended | outgrow | outgrew | outgrown | become too big or mature for | He outgrew his old shoes. |
| REF2-IRR-094 | core | overcome | overcame | overcome | succeed despite difficulty | They overcame several problems. |
| REF2-IRR-095 | extended | overdo | overdid | overdone | do too much | He overdid the decorations. |
| REF2-IRR-096 | extended | overdraw | overdrew | overdrawn | take more money than is in an account | He overdrew his account. |
| REF2-IRR-097 | extended | overeat | overate | overeaten | eat too much | We overate at the festival. |
| REF2-IRR-098 | extended | overhear | overheard | overheard | hear by accident | I overheard a short conversation. |
| REF2-IRR-099 | extended | oversleep | overslept | overslept | sleep too long | She overslept and missed the bus. |
| REF2-IRR-100 | extended | overtake | overtook | overtaken | catch up and pass | The cyclist overtook the bus. |
| REF2-IRR-101 | core | pay | paid | paid | give money in exchange | She paid for the tickets. |
| REF2-IRR-102 | extended | plead | pleaded / pled | pleaded / pled | ask urgently or state a plea | He pleaded for another chance. |
| REF2-IRR-103 | extended | preset | preset | preset | set in advance | She preset the timer. |
| REF2-IRR-104 | extended | proofread | proofread | proofread | check writing for errors | He proofread his essay twice. |
| REF2-IRR-105 | extended | prove | proved | proved / proven | show something is true | The experiment proved the idea wrong. |
| REF2-IRR-012 | core | put | put | put | place | I put the books on the shelf. |
| REF2-IRR-106 | extended | quit | quit / quitted | quit / quitted | stop doing something | She quit the team last year. |
| REF2-IRR-011 | core | read | read | read | understand written words | He read the story yesterday. |
| REF2-IRR-107 | extended | rebuild | rebuilt | rebuilt | build again | The town rebuilt the old bridge. |
| REF2-IRR-108 | extended | redo | redid | redone | do again | I redid the difficult exercise. |
| REF2-IRR-109 | extended | remake | remade | remade | make again | They remade the video for class. |
| REF2-IRR-110 | extended | repay | repaid | repaid | pay back | He repaid the money he borrowed. |
| REF2-IRR-111 | extended | reset | reset | reset | set again | I reset the clock after the power cut. |
| REF2-IRR-112 | extended | retell | retold | retold | tell again | She retold the story in her own words. |
| REF2-IRR-113 | extended | rewind | rewound | rewound | wind back | He rewound the recording. |
| REF2-IRR-114 | core | ride | rode | ridden | travel on a bicycle or horse | We rode our bikes to school. |
| REF2-IRR-115 | core | ring | rang | rung | make a bell sound | The bell rang at the end of class. |
| REF2-IRR-116 | core | rise | rose | risen | move upward | The river rose after the storm. |
| REF2-IRR-117 | core | run | ran | run | move quickly on foot | He ran around the track. |
| REF2-IRR-118 | core | say | said | said | speak words | She said goodbye at the station. |
| REF2-IRR-119 | extended | seek | sought | sought | try to find | The group sought a quieter room. |
| REF2-IRR-120 | core | sell | sold | sold | exchange for money | He sold his old bicycle. |
| REF2-IRR-121 | core | send | sent | sent | cause to go | I sent a message to my cousin. |
| REF2-IRR-122 | core | set | set | set | put in a position or arrange | She set the alarm for seven. |
| REF2-IRR-123 | extended | sew | sewed | sewn / sewed | join cloth with stitches | My grandmother sewed a button onto my coat. |
| REF2-IRR-124 | core | shake | shook | shaken | move quickly back and forth | She shook the bottle gently. |
| REF2-IRR-125 | extended | shave | shaved | shaved / shaven | remove hair | He shaved before the interview. |
| REF2-IRR-126 | extended | shed | shed | shed | lose or drop naturally | The tree shed its leaves in autumn. |
| REF2-IRR-127 | core | shine | shone / shined | shone / shined | give light or make something bright | The sun shone through the window. |
| REF2-IRR-128 | core | shoot | shot | shot | send out or direct quickly | She shot the ball toward the goal. |
| REF2-IRR-129 | core | show | showed | shown / showed | display | He showed us his drawings. |
| REF2-IRR-130 | extended | shrink | shrank / shrunk | shrunk | become smaller | My wool jumper shrank in the wash. |
| REF2-IRR-131 | core | shut | shut | shut | close | We shut the windows before leaving. |
| REF2-IRR-132 | core | sing | sang | sung | make musical sounds | They sang together at the concert. |
| REF2-IRR-133 | core | sink | sank / sunk | sunk | go below the surface | The toy boat sank in the pond. |
| REF2-IRR-134 | core | sit | sat | sat | rest seated | She sat near the window. |
| REF2-IRR-135 | core | sleep | slept | slept | rest in sleep | I slept well last night. |
| REF2-IRR-136 | core | slide | slid | slid | move smoothly along a surface | The book slid off the desk. |
| REF2-IRR-137 | extended | sling | slung | slung | throw or hang loosely | He slung his bag over one shoulder. |
| REF2-IRR-138 | extended | smell | smelled / smelt | smelled / smelt | notice an odour | We smelled fresh bread from the bakery. |
| REF2-IRR-139 | extended | sneak | sneaked / snuck | sneaked / snuck | move quietly or secretly | The cat sneaked into the kitchen. |
| REF2-IRR-140 | extended | sow | sowed | sown / sowed | plant seeds | The farmer sowed the field with wheat. |
| REF2-IRR-014 | core | speak | spoke | spoken | talk | She spoke clearly in the meeting. |
| REF2-IRR-141 | extended | speed | sped / speeded | sped / speeded | move fast or increase speed | The train sped through the countryside. |
| REF2-IRR-142 | extended | spell | spelled / spelt | spelled / spelt | write letters of a word | He spelled the name correctly. |
| REF2-IRR-143 | core | spend | spent | spent | use time or money | We spent an hour reading. |
| REF2-IRR-144 | extended | spill | spilled / spilt | spilled / spilt | let liquid fall out | She spilled juice on the table. |
| REF2-IRR-145 | extended | spin | spun | spun | turn rapidly | The wheel spun in the wind. |
| REF2-IRR-146 | extended | spit | spat / spit | spat / spit | force saliva from the mouth | The child spat out the bitter medicine. |
| REF2-IRR-147 | core | split | split | split | divide into parts | We split the class into groups. |
| REF2-IRR-148 | extended | spoil | spoiled / spoilt | spoiled / spoilt | damage enjoyment or quality | The rain spoiled our picnic. |
| REF2-IRR-149 | core | spread | spread | spread | extend over an area | He spread the blanket on the grass. |
| REF2-IRR-150 | extended | spring | sprang / sprung | sprung | jump suddenly | The cat sprang onto the shelf. |
| REF2-IRR-151 | core | stand | stood | stood | be upright on feet | We stood in a line. |
| REF2-IRR-152 | core | steal | stole | stolen | take without permission | Someone stole the bicycle. |
| REF2-IRR-153 | core | stick | stuck | stuck | attach or remain attached | The label stuck to the box. |
| REF2-IRR-154 | core | sting | stung | stung | cause pain with a sting | A bee stung my arm. |
| REF2-IRR-155 | extended | stink | stank / stunk | stunk | smell very bad | The rubbish stank after a hot day. |
| REF2-IRR-156 | extended | strike | struck | struck / stricken | hit or affect suddenly | Lightning struck a nearby tree. |
| REF2-IRR-157 | extended | string | strung | strung | put items on a thread | They strung lights across the room. |
| REF2-IRR-158 | extended | strive | strove / strived | striven / strived | try very hard | She strove to improve her writing. |
| REF2-IRR-159 | extended | swear | swore | sworn | make a serious promise | He swore to tell the truth. |
| REF2-IRR-160 | core | sweep | swept | swept | clean with a broom | She swept the classroom floor. |
| REF2-IRR-161 | core | swim | swam | swum | move through water | They swam in the pool. |
| REF2-IRR-162 | core | swing | swung | swung | move back and forth | The gate swung open. |
| REF2-IRR-005 | core | take | took | taken | carry or receive | She took her umbrella. |
| REF2-IRR-010 | core | teach | taught | taught | help someone learn | Our teacher taught us a new song. |
| REF2-IRR-163 | core | tear | tore | torn | rip | He tore the old paper in half. |
| REF2-IRR-164 | core | tell | told | told | give information in words | She told us a funny story. |
| REF2-IRR-009 | core | think | thought | thought | have an opinion or idea | We thought the task was easy. |
| REF2-IRR-165 | core | throw | threw | thrown | send through the air | He threw the ball to me. |
| REF2-IRR-166 | extended | thrust | thrust | thrust | push suddenly | He thrust the door open. |
| REF2-IRR-167 | extended | tread | trod | trodden / trod | step or walk | She trod carefully on the wet path. |
| REF2-IRR-168 | extended | troubleshoot | troubleshot / troubleshooted | troubleshot / troubleshooted | find and fix technical problems | They troubleshot the printer. |
| REF2-IRR-169 | extended | undergo | underwent | undergone | experience a process | The building underwent repairs. |
| REF2-IRR-170 | extended | underlie | underlay | underlain | form the basis of | Trust underlay their teamwork. |
| REF2-IRR-171 | core | understand | understood | understood | grasp meaning | I understood the instructions. |
| REF2-IRR-172 | extended | undertake | undertook | undertaken | agree to do a task | The club undertook a new project. |
| REF2-IRR-173 | core | undo | undid | undone | reverse an action | He undid the knot. |
| REF2-IRR-174 | extended | uphold | upheld | upheld | support or maintain | The judge upheld the decision. |
| REF2-IRR-175 | core | upset | upset | upset | make someone unhappy or disturb | The news upset him. |
| REF2-IRR-176 | core | wake | woke / waked | woken / waked | stop sleeping | She woke early to catch the train. |
| REF2-IRR-177 | core | wear | wore | worn | have clothes on | He wore a blue jacket. |
| REF2-IRR-178 | extended | weave | wove / weaved | woven / weaved | make fabric by crossing threads | They wove a basket from reeds. |
| REF2-IRR-179 | extended | weep | wept | wept | cry | The child wept after losing the toy. |
| REF2-IRR-180 | core | win | won | won | be successful in a contest | Our class won the quiz. |
| REF2-IRR-181 | extended | wind | wound | wound | turn or wrap around | She wound the string around the box. |
| REF2-IRR-182 | extended | withdraw | withdrew | withdrawn | take back or remove | He withdrew his name from the list. |
| REF2-IRR-183 | extended | withhold | withheld | withheld | keep back | The editor withheld the article. |
| REF2-IRR-184 | extended | withstand | withstood | withstood | resist or survive | The old wall withstood the storm. |
| REF2-IRR-185 | extended | wring | wrung | wrung | twist to squeeze | She wrung water from the towel. |

## Usage and variants — mandatory audit focus
- **REF2-IRR-001 — be:** Present: am/is/are; past was/were depends on subject. Hypothetical were is separate.
- **REF2-IRR-019 — bear:** Born is the customary birth-related participle; borne is used for carrying or enduring.
- **REF2-IRR-026 — bet:** Betted also occurs in some varieties; default classroom form is bet-bet-bet.
- **REF2-IRR-037 — burn:** Burned and burnt are standard alternatives; preferences differ by dialect and context.
- **REF2-IRR-027 — bid:** This row means offer a price (bid-bid-bid). Bid meaning command can have older bade/bidden forms.
- **REF2-IRR-035 — broadcast:** Broadcast-broadcast-broadcast is common; broadcasted also occurs.
- **REF2-IRR-047 — dive:** Dove is a past simple alternative especially in US English; dived is also standard.
- **REF2-IRR-049 — dream:** Dreamed and dreamt are both used; region and context affect preference.
- **REF2-IRR-066 — get:** Gotten is principally AmE participle for receiving/becoming; got is common BrE, and have got can mean possession.
- **REF2-IRR-068 — hang:** Hung is for suspension. Hanged is the customary past for execution.
- **REF2-IRR-076 — kneel:** Kneeled and knelt are both valid.
- **REF2-IRR-077 — lay:** Transitive lay (put down): lay-laid-laid. Intransitive lie (recline): lie-lay-lain.
- **REF2-IRR-079 — lean:** Leaned and leant differ in regional frequency.
- **REF2-IRR-080 — leap:** Leaped and leapt are both used.
- **REF2-IRR-081 — learn:** Learned and learnt are both valid; often differing in regional preference.
- **REF2-IRR-085 — lie:** Lie (recline): lie-lay-lain; lie meaning tell a falsehood is regular: lied-lied. Compare lay-laid-laid.
- **REF2-IRR-086 — light:** Lit and lighted are both used; lighted can also serve adjectival uses.
- **REF2-IRR-102 — plead:** Pleaded is broad standard; pled occurs especially in US legal and informal contexts.
- **REF2-IRR-105 — prove:** Proved is regular past; participle proved or proven depends on variety and usage.
- **REF2-IRR-106 — quit:** Quit is the usual contemporary form; quitted appears in some contexts/varieties.
- **REF2-IRR-011 — read:** All forms spelled read; base pronounced /riːd/ and past/participle /red/.
- **REF2-IRR-123 — sew:** Past is sewed; sewn or sewed can occur as participle.
- **REF2-IRR-125 — shave:** Shaved is common participle; shaven is also used, often adjectivally.
- **REF2-IRR-127 — shine:** Shone commonly means emitted light; shined often means polished; regional variation exists.
- **REF2-IRR-130 — shrink:** Shrank commonly past; shrunk also occurs, and shrunk is participle.
- **REF2-IRR-133 — sink:** Sank is usual past; sunk also occurs, especially in some usages.
- **REF2-IRR-138 — smell:** Smelled and smelt differ in usage and regional preference.
- **REF2-IRR-141 — speed:** Sped and speeded are both used; speeded is common in some technical/causative contexts.
- **REF2-IRR-142 — spell:** Spelled and spelt are standard regional alternatives.
- **REF2-IRR-144 — spill:** Spilled and spilt are standard alternatives.
- **REF2-IRR-146 — spit:** Spat and spit both occur, with regional variation.
- **REF2-IRR-148 — spoil:** Spoiled and spoilt differ in common regional uses.
- **REF2-IRR-150 — spring:** Sprang is common past; sprung also occurs. Participle is sprung.
- **REF2-IRR-155 — stink:** Stank and stunk both occur as past; stunk is usual participle.
- **REF2-IRR-156 — strike:** Struck is typical participle for hitting; stricken in some fixed or affected senses.
- **REF2-IRR-158 — strive:** Strove/striven and strived/strived are both possible; avoid treating this as a single simple rule.
- **REF2-IRR-167 — tread:** Trod is past; trodden is common participle, trod also occurs.
- **REF2-IRR-176 — wake:** Woke and woken are usual; waked is also available in certain uses.
- **REF2-IRR-178 — weave:** Wove/woven for making fabric; weaved may be used for moving in and out.
- **REF2-IRR-181 — wind:** Wind (turn/wrap) is wound-wound (/waʊnd/); wind (moving air) is a different noun/verb use.
- **REF2-IRR-074 — input:** Input and inputted both occur depending on context.
- **REF2-IRR-139 — sneak:** Snuck is more common in North American usage; sneaked is standard.
- **REF2-IRR-168 — troubleshoot:** Troubleshot is widely used; troubleshooted also appears.
- **REF2-IRR-170 — underlie:** Not to be confused with lie-lay-lain; underlie-underlay-underlain.

## Independent academic review questions
1. Independently check **every candidate ID** for correct forms and relevant variants, in particular false exceptions, region-specific forms, sense-dependent forms and any edge cases.
2. Verify every gloss and context example matches the relevant verb sense and tense, without accidental mixed meanings; corrections must cite exact ID.
3. Audit priority tiers: core is essential or high-use for day-to-day learning; extended should not be mislabeled as necessary A1 vocabulary. Do not assign CEFR mastery from recognition.
4. Explicitly check `lie`/ `lay`, `hang`, `get` regional variants, `read`, `bear`, `strike`, `weave`, and `bid`.
5. Confirm no overlaps with existing six approved items, and that the earlier fifteen Wave 1 IDs remain stable; note any unsupported or omitted high-frequency verb.
6. Recommend any changes needed to support fast A–Z / V2 / V3 / variant search, accessible 320px scroll, and original examples without excessive clutter. These are implementation suggestions only.
7. State whether this corpus can be used as an academic source for a **read-only lookup table**, not scored instruction or language proficiency evidence.

## Required verdict format
**ACADEMIC_VERDICT:** PASS / PASS_WITH_REQUIRED_CHANGES / FAIL / INSUFFICIENT_EVIDENCE  
**ITEM_COVERAGE:** [total reviewed] / 185; [PASS] / [REQUIRES_CORRECTION] counts by ID.  
**MANDATORY_CORRECTIONS:** Each `REF2-IRR-###`, precise wording/form, evidence-backed explanation and replacement.  
**OPTIONAL_IMPROVEMENTS:** non-blocking, separated.  
**MISSING_HIGH_PRIORITY_VERBS:** list with reasons, or NONE.  
**ENGINEERING_IMPLEMENTATION:** OUT_OF_SCOPE / NOT_TESTED.  
**PRODUCTION_RELEASE:** NOT_AUTHORIZED.

## NotebookLM handoff
**KEEP:** Only current permanent English NotebookLM academic baseline and SLE-MASTER-001, with superseded baseline copies replaced.
**REMOVE:** Earlier temporary review batch including `SLE_REFERENCE_LIBRARY_V2_WAVE1_R1_20261120.md` if selected. Its Writing/Frequency drafts remain safely archived in GitHub.
**ADD:** ONLY this `SLE_REFERENCE_LIBRARY_V2_IRREGULAR_FULL_R1_20261120.md` as the active temporary source.

**Short NotebookLM chat message:** Review this irregular verb corpus against permanent SLE sources. Audit all IDs and give the required verdict, with exact corrections.

**Release boundary:** Run deterministic validation and integrate only **after** actual independent NotebookLM verdict, corrections and separate owner release approval. Do not edit the original six pilot records.
