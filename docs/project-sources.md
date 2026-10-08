# Project article sources

These notes record the evidence and asset origins behind the eight portfolio articles. Source repositories were read without modification. Publication dates refer to the website articles; the opening paragraphs give the dates of the original projects. Personal contributions follow Miguel’s clarifications on 2026-10-03.

## Public repository links before deployment

An anonymous link check on 2026-10-04 returned 404 for `mining-deti-coins`, `smart-weather-station`, `src-project-2` and `ua-bd-bud`, including the miner's linked PDFs. Their URLs match the local Git origins. Miguel confirmed that these repositories will be made public before deployment, so their article links are retained. Making those four repositories public and checking their links again is a release prerequisite; no repository visibility was changed during the website work.

## European Portuguese versions

Every English article listed below has a complete European Portuguese translation in the same `src/content/projects/<slug>/` directory, named `pt.md` or `pt.mdx`, with a shared `translationKey`. The translations preserve the technical claims, contributor attribution, source-code excerpts and media. Captions, alternative text, diagram labels and metadata are translated; original project images and recordings are reused. Number formatting follows Portuguese conventions, including decimal commas and “mil milhões” for English billions.

`network-anomaly-detection/assets/dns-comparison-pt.svg` is a translated version of the recreated English chart, with identical data, scale and bar lengths. It is a website illustration derived from the recorded results, not an original project screenshot. The moving-average demo uses the same ROM data and calculation in both languages; its controls, graph descriptions and status text are localized.

The expanded Aditus, Gestire, AES gateway and moving-average articles use MDX to place original figures beside their explanations. Changing `.md` to `.mdx` preserves the content IDs and URLs. Original report imagery is distinguished from the new, source-derived diagrams, which are rendered as static SVG through `MermaidDiagram`. All copied or extracted assets are stored in the website repository.

## Aditus

- Article: `src/content/projects/aditus/en.mdx`.
- Repository: `https://github.com/miguelovila/aditus-door-access-system` (local origin).
- Sources: `README.md`, `DOCUMENTATION.md`, `report.pdf` (text extraction), git history, `smartphone_client_app/lib/core/security/crypto_service.dart`, `smartwatch_client_app/lib/services/pairing_service.dart`, `aditus_backend_service/app/models/user.py`, `esp32_door_controller/esp32_door_controller.ino`.
- Identity/date: report is credited to Miguel Vila, student 107276. Git history starts 2025-10-27; implementation changes continue through 2026-01-05. This supports individual development across late 2025/early 2026. No unverified course title or degree label added.
- Verified details: RSA-2048 and SHA-256, locally stored PEM private keys, per-device registrations, BLE long writes, six-digit/five-minute watch pairing, permission evaluation order, eight-step firmware/app integration described without claiming a production security audit.
- Scope: successful unlock uses LED only. Watch can unlock over BLE after pairing without phone/internet, but ESP32 still requires backend connectivity. Known firmware identity binding, challenge quality, unverified TLS and log URL issues are acknowledged; report records intermittent watch/controller hangs without a confirmed cause.
- Tests/hardware: no fresh hardware test claimed. Screens and recorded demonstration are original evidence.
- Expanded protocol and control detail checked in `smartphone_client_app/lib/features/door_unlock/presentation/bloc/door_unlock_bloc.dart`, the firmware and backend device routes: four GATT characteristics, identity/permission/key exchange, second public-key fetch before verification, 256-byte signature encoded as 344 Base64 characters, exact `allowLongWrite` excerpt, separate thirty-second challenge/status waits, firmware state checks and disconnect reset.
- Pairing fields and behavior checked in `aditus_backend_service/app/models/pairing_session.py` and `app/routes/devices.py`: five-minute expiry, used flag, separate watch key pair and registration, no watch JWT issued by this flow. Backend models support the documented ownership/permission distinction and exception precedence. History loads twenty records at a time.
- The original report's page-9 sequence image was inspected but not used: it reverses challenge/signature arrows and includes an unimplemented distance field. The article's new Mermaid sequence follows the firmware/client success path instead. It is not presented as an original report figure.

Copied original assets (no transformations):

| Website path under `src/content/projects/aditus/assets/` | Source under `aditus-door-access-system/screenshots/` |
| -------------------------------------------------------- | ----------------------------------------------------- |
| `watch-door.png`                                         | `watch_closest _door.png`                             |
| `nearby-doors.png`                                       | `nearby_door_list.png`                                |
| `watch-pairing.png`                                      | `smartwatch_registration.png`                         |
| `device-management.png`                                  | `device_management.png`                               |
| `device-registration.png`                                | `device_registration_screen.png`                      |
| `unlock-progress.png`                                    | `door_unlocking_2.png`                                |
| `watch-pair-code.png`                                    | `watch_pair_code_input.png`                           |
| `door-details.png`                                       | `door_details.png`                                    |
| `group-members.png`                                      | `manage_group_members.png`                            |
| `access-history.png`                                     | `access_histry_screen.png`                            |

Original `screenshots/smartwatch_unlock_flow.mp4` is also copied to `public/project-media/aditus/watch-unlock.mp4` (6.1 MB). The article uses native video controls, `preload="none"`, no autoplay, an accessible label, explanatory caption and direct fallback link. No video transformation was made. Cover uses the existing watch screenshot; the video poster was extracted from the original recording at one second using FFmpeg, without compositing or illustration.

There are nine inline screenshots plus the cover. Former gallery images are reused inline. The two pairing screenshots show separate historical example codes; the caption makes this explicit. The group-members image contains demo identities and a numeric display name, not a password. The door-details caption identifies its unfinished log shortcut, and the history caption explains the controller log-route limitation.

## Gestire

- Article: `src/content/projects/gestire/en.mdx`.
- Repository: `https://github.com/miguelovila/gestire-smart-locker` (local origin).
- Sources: `README.md`, `DOCUMENTATION.md`, `deliverables/e5-construction/v1.X.X/AS-E5-Construction.md`, `backend/routes/equipments.py`, `backend/routes/locker.py`, `lockers/src/main.cpp`, Flutter client navigation/layout, tests README, git history.
- Team/date: 2023, Análise de Sistemas, University of Aveiro; Diogo Silva, Ivo Delgado, Martim Carvalho, Miguel Vila. Contributor-specific areas are stated in README and corroborated by Miguel's commits in May/June 2023 (UI, backend/database/authentication, reservations, firmware, tests). The user confirmed during this task that Miguel handled most implementation, including the Flutter app and locker hardware; the article reflects that without diminishing teammates.
- Verified details: pickup-code issue/consumption; scheduled two-minute pickup release; return-code `put` operation; eight active-low relay outputs and ten-second activation; eight firmware states; adaptive Flutter navigation/catalogue.
- Scope: hardware demo shows assembled controller/relays, not verified item sensing or door closure. PIN state lives in memory, reservation state in SQLite. University SSO remained a plan; current implementation uses local users. Hosted demo retired; no `liveUrl` supplied. Room overlap/expiry edge cases acknowledged without claiming tests validate everything.
- Presentation images are explicitly labelled early mockups, not final application screenshots. The controller photo, five selected interface designs, locker concept and original architecture images were visually inspected.
- Added implementation details checked against `client/gestire/lib/{dashboard,room_reservation,equipment_reservation}.dart`, `backend/routes/{rooms,equipments,locker,users}.py`, `backend/database/con.py`, `lockers/src/main.cpp`, and `tests/tester.py`: navigation breakpoints at 1000/800 pixels; client/API filter split; seconds-based reservations with a fifteen-minute room minimum; separate catalogue/reservation tables; per-user 100+100 record limits; pending-code fields, scheduler release and code consumption; eight firmware states and blocking relay interval; per-query commits and original state-dependent test limitations.
- The source-derived Mermaid collection sequence shows code consumption before relay activation. Return behavior distinguishes requesting a `put` code from accepting it. The proposed observations field in the return mockup is explicitly distinguished from the implemented token-only request. Equipment-duration and optional-reason mismatches are documented without claiming they were corrected in the source project.

Copied original assets (no transformations):

| Website path under `src/content/projects/gestire/assets/` | Source under `gestire-smart-locker/images/` |
| --------------------------------------------------------- | ------------------------------------------- |
| `locker-controller.png`                                   | `Screenshot From 2026-09-23 21-28-16.png`   |
| `room-browser-design.jpg`                                 | `apresentacao_2_page_8_1.jpg`               |
| `reservation-design.jpg`                                  | `apresentacao_2_page_9_1.jpg`               |
| `pickup-code-design.jpg`                                  | `apresentacao_3.pptx_page_2_1.jpg`          |
| `locker-bank-concept.jpg`                                 | `apresentacao_2_page_14_1.jpg`              |
| `reservation-records-design.jpg`                          | `apresentacao_2_page_12_1.jpg`              |
| `equipment-return-design.jpg`                             | `apresentacao_2_page_13_1.jpg`              |

Two original images were extracted losslessly with `pdfimages -png` from `deliverables/e5-construction/AS-E5-Construcao.docx.pdf`:

| Website path under `src/content/projects/gestire/assets/` | PDF source      | Dimensions |
| --------------------------------------------------------- | --------------- | ---------- |
| `original-logical-architecture.png`                       | Image 0, page 4 | 749 × 601  |
| `original-deployment-diagram.png`                         | Image 1, page 5 | 1250 × 531 |

Captions distinguish plans from implemented behavior: university IdP versus local accounts, MicroPython versus C++/Arduino, and the drawn database server versus embedded SQLite. The larger locker-bank drawing is labelled a concept; the implemented controller still has eight outputs. The article has eight inline figures plus the controller cover.

The embedded hardware demonstration, `https://youtube.com/shorts/Ew3Ff9O0Odw`, comes from the original Gestire README. `YouTubeEmbed` uses its video ID with a portrait player on `youtube-nocookie.com` and a direct viewing link. The video is externally hosted; images, figures and diagrams are local and the website build does not fetch the video.

## AES IoT gateway

- Article: `src/content/projects/aes-iot-gateway/en.mdx`.
- Repository: `https://github.com/miguelovila/custom-aes-encripted-iot-gateway`. Default branch confirmed from local `origin/HEAD`: `master`.
- Context: `IotGatewayPresentation.pdf` title slide identifies Miguel Vila and Sistemas Integrados para Aplicações Embutidas. Git history records development on 2026-01-21 through 2026-01-29. Vivado 2025.1 is the tool version, not the project year.
- Ownership: the user explicitly confirmed on 2026-10-03 that they implemented the entire project. This also agrees with the single-author presentation and source history.
- Hardware and data path: root README, `SimplifiedIotGateway/IoTGatewayApp/src/main.c`, `aes_driver.c`, `udp_driver.c`, and sensor drivers; `IotGatewayController/protocol.py` and `network.py`; Vivado design screenshots in the presentation.
- AES implementation and assertions: `CoreAes128/src/aes_core.vhd`, round/key-expansion modules, `CoreAes128/tb/aes_core_tb.vhd` (four expected ciphertext assertions), and `CoreAes128/Makefile` (`run-all` target).
- Approximate twelve-cycle block processing is described in the README and supported by the core's initial, nine regular, final, and done states. No throughput benchmark or software-vs-hardware speedup is claimed.
- System runs at 100 MHz. Original timing screenshot reports 1.024 ns worst setup slack and no failing endpoints. The article identifies this as the integrated system's captured report, not a current synthesis result or AES-only measurement.
- Protocol limitation follows directly from source and README: individual blocks without authentication/replay protection, ASCII commands including key updates. The article avoids implying a production security protocol.
- `src/content/projects/aes-iot-gateway/assets/gateway-demo.png` is the current cover image. An earlier article version used an 800×450 JPEG extracted from image 0 on page 1 of `IotGatewayPresentation.pdf`; that JPEG is no longer included.
- `src/content/projects/aes-iot-gateway/assets/timing-summary.jpg` is embedded image 20 on page 10 of that PDF, extracted without alteration (951×307).
- The current article embeds the demonstration at `https://www.youtube.com/watch?v=wVWUDfTZosg` with `YouTubeEmbed` in landscape format and a direct viewing link. An earlier local MP4 conversion of `IotGatewayThumbnail.gif` is no longer included or imported.
- Deeper hardware claims checked against `aes_core.vhd`, `aes_round.vhd`, `key_expansion.vhd`, `gf_mult_by2.vhd`, `mix_columns.vhd`, and the packaged AXI wrapper: iterative rounds, start-edge detection, finite-field doubling snippet, register concatenation, reset-polarity inversion, status bits and address ranges. Both displayed source snippets were checked against the originals.
- Sensor/network claims checked against `main.c`, `adxl362_driver.c`, `adt7420_driver.c`, `udp_driver.h` and `udp_driver.c`: default 500 ms updates, little-endian accelerometer-register conversion, sequence/reserved bytes, 42-byte Ethernet/IPv4/UDP headers outside the 17-byte application payload, broadcast transmission without ARP and a fixed-header receive assumption.
- The new network diagram uses actual configured direction: firmware `Udp_Init(..., 5000, 6000)`, Python `UDP_LISTEN_PORT=6000`, `FPGA_CMD_PORT=5000`, broadcast destination `192.168.1.255`. Old presentation/sub-README port labels disagree and were not used as the current protocol reference. Host receive/decode/UI behavior follows `network.py`, `protocol.py`, `main.py` and `gui.py`.
- Captured resource figures are for the integrated gateway: 8,627 LUTs (13.61%), 10,570 flip-flops, and 53 BRAMs (39.26%). They are not claimed as the AES core's isolated cost or a fresh synthesis result.

Additional assets under `src/content/projects/aes-iot-gateway/assets/`:

| Asset                      | Original source                                                 | Processing / dimensions                                    |
| -------------------------- | --------------------------------------------------------------- | ---------------------------------------------------------- |
| `system-architecture.png`  | `IotGatewayPresentation.pdf`, physical page 8 / printed slide 7 | Full-slide `pdftoppm` render, 1600 × 900                   |
| `aes-round-reference.jpg`  | Same PDF, physical page 6, embedded image 13                    | Unchanged JPEG extracted with `pdfimages -all`, 1004 × 691 |
| `aes-waveform.jpg`         | Same PDF, physical page 7, embedded image 16                    | Unchanged extracted JPEG, 1590 × 457                       |
| `vivado-block-design.jpg`  | Same PDF, physical page 9, embedded image 19                    | Unchanged extracted JPEG, 1900 × 761                       |
| `resource-utilization.jpg` | Same PDF, physical page 10, embedded image 21                   | Unchanged extracted JPEG, 577 × 298                        |

The AES reference figure is credited as NIST material used in the original presentation, not claimed as Miguel's original implementation diagram. The article has six inline figures plus the cover, one network diagram and the YouTube demonstration. Source-file links use the repository's `master` branch.

## Moving average filter

- Article: `src/content/projects/moving-average-filter/en.mdx`.
- Repository: `https://github.com/miguelovila/ua-lsd-moving-average-filter`; default branch `main`.
- Context and collaborators: `written_report/documento.tex` and PDF list June 2022, Luíz Fernando and Miguel Vila, Laboratório de Sistemas Digitais, University of Aveiro.
- Ownership: the user explicitly confirmed on 2026-10-03 that they implemented the project, although it was submitted with a colleague. The article credits implementation to Miguel and identifies Luíz as the submission collaborator, without inventing a component split. The original report remains the source for the project context and contributor names.
- Arithmetic: `ArithmeticUnit.vhd`, `RegisterBank.vhd`, `RomManager.vhd`; four-sample window x[n−2], x[n−1], x[n], x[n+1], signed conversion and integer division truncating toward zero. Indices 0, 1, 255 and filter-off mode bypass averaging.
- Timing, controls, and limits: `FiltroMediaMovel.vhd`, `ControlUnit.vhd`, `CleanInputManager.vhd`, `PulseGenerator.vhd`, `RamManager.vhd`; README and DOCUMENTATION.md. Demonstration advance is about 2 Hz on a 50 MHz clock, rather than an asserted throughput limit. RAM writes stay enabled while sample fetching is underway; no result-valid handoff is claimed.
- Verification: component stimulus testbenches and original simulation captures; no automated VHDL pass/fail assertions. `RomBinToDecTest.py` supplies independent expected decimal results. No new hardware tests were run for the article.
- `src/content/projects/moving-average-filter/assets/samples.json` is a flat array of 256 signed integers decoded from the first AST assignment (`romBinData`) of `RomBinToDecTest.py`. All 256 binary strings were checked against `NoisyTriangSignalROM256x8.vhd` and matched exactly. Example: n=2 uses −87, −83, −110, −87 and yields −91.
- The MDX imports `MovingAverageDemo` from `@/components/demos/MovingAverageDemo` and uses `client:visible`. All 256 browser-calculated outputs were compared with the original Python reference and matched. Prose explicitly calls it an arithmetic illustration rather than a simulation of FPGA timing.
- Exact asset copies: `signal-comparison.png` ← `written_report/smoothsignal.png`; `board-controls.jpg` ← `written_report/fpga.jpg`; `register-bank.png` ← `images/register-bank-lookahead.png`. Images retain their original annotations, with translated alt text and captions in each article version.
- The expanded ROM-fetch table was derived from `RomManager.vhd` and VHDL signal-update semantics, not a new simulation capture: stable address change detected at edge 1, current address selected at edge 2, current sample captured/next selected at edge 3, next captured/ready raised at edge 4, bank consumes ready at edge 5. The diagram's reset arrow is qualified as initialization because this module has no reset port.
- The register-bank excerpt matches the four source assignments and their simultaneous updates. `ArithmeticUnit.vhd` supports sum range −512..508, signed 8-bit output and division truncating toward zero; the article distinguishes this from an arithmetic right shift for negative nonmultiples of four.
- `RamManager.vhd` and `CleanTriangSignalRAM256x8.vhd` show a separate wrapping clear counter and registered RAM-write handoff. The article does not claim each sweep begins at zero or takes exactly 256 clocks. `ControlUnit.vhd` and `PulseGenerator.vhd` support the qualified reset/pause discussion, including retained pulse state while stopped and the reset check inside the enabled branch.
- Original waveform figures are stimulus-driven inspection material. The arithmetic testbench keeps filtering enabled; the independent report output table supplies on/off comparisons. No automated assertion result is invented. The original Python reference was run successfully and produced 256 input/output pairs; no new synthesis, programming or VHDL simulation was performed.

Six more assets copied byte-for-byte from `ua-lsd-moving-average-filter/written_report/` into `src/content/projects/moving-average-filter/assets/`:

| Website filename             | Original                | Dimensions |
| ---------------------------- | ----------------------- | ---------- |
| `top-level-schematic.png`    | `schematic.png`         | 1346 × 664 |
| `rom-controller.png`         | `rommanager.png`        | 723 × 274  |
| `control-states.png`         | `controlunit.png`       | 754 × 323  |
| `register-bank-waveform.png` | `registerbankval.png`   | 1231 × 224 |
| `arithmetic-waveform.png`    | `arithmeticunitval.png` | 975 × 185  |
| `output-checks.png`          | `values.png`            | 1034 × 117 |

These existing report assets match the dimensions of the embedded PDF images, avoiding screenshot recompression. The expanded article uses eight inline figures plus its original plot cover. The existing ROM dataset and interactive arithmetic demo are preserved. Miguel's explicit implementation attribution takes precedence over the old report's generic equal-participation statement; Luíz remains credited as the co-submitter.

## Mining DETI coins

- Article: `src/content/projects/deti-coin-miner/en.md`.
- Repository: `https://github.com/miguelovila/mining-deti-coins`; default branch `main`.
- Context: `report.pdf` title identifies Miguel Vila and Matilde Teixeira, High Performance Architectures 2024/2025. Git records November–December 2024 work and report commit on 2024-12-04.
- Ownership: the user explicitly confirmed on 2026-10-03 that they did most of the implementation. The article uses this wording without inventing ownership of every module. Matilde remains credited as a collaborator.
- Starting code: `proposal.pdf` lists supplied Tomás Oliveira e Silva reference code, including specialized MD5 macro core, scalar miner, AVX and NEON hash routines, CUDA hash example, and test/storage utilities. The article credits this instead of implying the entire codebase was written from scratch.
- SIMD/OpenMP: `includes/avx2/md5_cpu_avx2.h`, AVX and AVX512 alternatives, and `includes/avx2/deti_coins_cpu_avx2_omp_search.h`. Eight-lane word-transposed input layout, per-thread buffers, critical initialization/storage, reductions.
- CUDA: `deti_coins_cuda_kernel_search.cu` and `includes/cuda/deti_coins_cuda_search.h`. 95 candidates per thread/launch, `atomicAdd` discovery allocation, 1024×4-byte result buffer. The claim is small result transfers, not guaranteed unique candidate ranges.
- Historical 120-second totals from `report.pdf` page 1: scalar 1.1715e9, AVX 3.3672e9, AVX2 6.1125e9, AVX512F 1.6198e10, CUDA 5.4459e11. Rates are totals divided by 120; AVX2/scalar ratio ~5.2185. AVX512 used a different CPU. Article labels all results historical and counts as attempts, including repeated candidates.
- AVX2/OpenMP comparison from page 2: DEBUG=0 7.9936e10 and DEBUG=1 1.3559e10 attempts. Makefile also changes -O2 vs -O0; article does not attribute the difference purely to I/O and avoids assigning an unrecorded thread count.
- Phrase experiment from page 2: `AAD!` 7.5383264304e10 versus `Arquiteturas Alto Desempenho 24/25!!` 7.13487416e8. Verified 36-byte maximum phrase leaves one incrementing byte after four random bytes in the fixed 52-byte format. The special AVX2/OpenMP source regenerates prefixes on wrap.
- Networking: `includes/orchestration/{client,server}.h`, `includes/common/communication.h`, and vault header; HELLO / CONFIG / COIN_FOUND, server-side hash rechecking, no disjoint-range assignment. Avoided claiming a scheduler or unique work.
- WebAssembly: report and `deti_coins_webassembly.c`; historical billion-attempt runs differ from committed 700-million-attempt constant. No live browser miner or NEON miner is claimed.
- `src/content/projects/deti-coin-miner/assets/network-workers.png` is embedded image 1 on page 2 of `report.pdf`, extracted losslessly using `pdfimages -png` (813×263). It is an original capture, not a mockup.

## Weather station

- Article: `src/content/projects/weather-station/en.md`.
- Repository: `https://github.com/miguelovila/smart-weather-station` (local Git origin).
- Team/year/course: local README and DOCUMENTATION identify Miguel Vila, Francisco Ribeiro, 2025, Embedded Systems Architectures at University of Aveiro. Hardware photos also date to July 2025. No commit exists in the local main branch, so no commit date is used.
- User-confirmed contributions: Miguel planned/built hardware, designed/built custom sensors and their drivers, and implemented BME280 driver. Francisco handled Grafana, MQTT, Wi-Fi, and SD card. Prose attributes accordingly.
- Wind sensor behavior checked against `main/wind_speed/wind_speed_sensor.c`, `main/wind_direction/wind_direction_sensor.c`, and task/config values in `main/main.c`: rising-edge pulses, seven-second window, three-second subsequent delay, four Hall inputs/eight directions, example calibration factor.
- BME280 driver scope and bus configuration: `main/bme280/` and `main/main.c`, with measurement notes in DOCUMENTATION.
- CSV-before-MQTT writes and topic split verified in `main/data_handler/data_handler.c`. No replay queue; QoS 0, initial broker recovery and memory limits are documented. Do not claim continuous wind sampling, calibrated accuracy, offline startup, guaranteed delivery, or production readiness.
- Pressure is forwarded on a kPa scale while labelled hPa in the prototype. Article caption explicitly explains the original dashboard label.
- Copied unchanged: `images/PXL_20250709_172444010.jpg` → `src/content/projects/weather-station/assets/assembled-station.jpg`; `images/PXL_20250709_172431186.jpg` → `controller-and-storage.jpg`; `images/image.png` → `grafana-dashboard.png`. Original photos are large and should be served through Astro image optimization.

## BUD helpdesk

- Article: `src/content/projects/bud-helpdesk/en.md`.
- Repository: `https://github.com/miguelovila/ua-bd-bud` (local Git origin).
- Team/year/course: README and DOCUMENTATION identify Miguel Vila and Miguel Reis, 2024, Databases at University of Aveiro. Local latest commit is 2024-06-05 and Git history has both names.
- User-confirmed contributions: equal collaboration, with Miguel Vila focused on complex database relationships and Windows Forms.
- Form generation and role filtering checked in `ui/BUD/Forms/NewTicketForm.cs`, with joins in `db/06_views.sql` (`ServiceCategoriesFields`). Department/room controls are special cases; do not claim arbitrary schema-driven validation.
- Table-valued input and exact displayed SQL excerpt from `db/02_sp.sql`, `CreateTicket`, lines 285–319. The excerpt is inside a larger transaction/try/catch; surrounding prose states this.
- Reopening behavior checked in `db/04_triggers.sql`; staff/requester reads and attachment behavior documented in README/DOCUMENTATION and SQL procedures.
- 20,000 generated tickets from sample-data documentation. Saved one-run timings in `IndexesTesting.rpt` (requester 110→34 ms, priority 47→13 ms); `db/09_test_indexes.sql` confirms single execution before/after and no cache control. Article includes this limitation and does not claim overall speedup.
- Scope: student helpdesk implementation based on BUD setting, not a deployed replacement of the actual university service. Direct client/database connection and UI-based role checks stated proportionally.
- Copied unchanged from `screenshots/`: `ticket_viewer_editor.png` → `src/content/projects/bud-helpdesk/assets/ticket-conversation.png`; `new_ticket_category.png` → `category-form.png`; `admin_dashboard_manage_tickets.png` → `staff-queue.png`.

## Network anomaly detection

- Article: `src/content/projects/network-anomaly-detection/en.md`.
- Repository: `https://github.com/miguelovila/src-project-2` (local Git origin).
- Team/year/course: README and DOCUMENTATION, and names on original `project_report.pdf`: Miguel Vila and Gonçalo Cunha, 2025, Security in Communications Networks at University of Aveiro. Latest local commit is 2025-07-03.
- User-confirmed contributions: Miguel implemented the analysis and rules in full. Article distinguishes implementation from submission with Gonçalo without commenting negatively on teammate participation.
- Main implementation: `analysis.ipynb`. Six detection cells, statistical baseline functions, actual timing calculation and minimum ten-flow condition inspected. `siemrules.py` is an earlier separate implementation, not called by notebook.
- Numerical observations come from README, documented rerun in DOCUMENTATION, and original PDF inspected with `pdftotext`: baseline flows 849,657 HTTPS +115,244 DNS =964,901; 197 sources; six private servers; HTTPS/DNS middle range 6.492–8.442; DNS device `.21` counts 34,283+33,327=67,610; baseline max 1,655; critical threshold twice that =3,310; HTTPS source `.122` ratio 10.820 versus baseline q95 approximately .112.
- External timing values and 19+3 combined report assessment retained as recorded results. Findings are candidates for investigation, not verified compromises or detection accuracy. No live collection, automated response, TLS decryption, decoded DNS query data, or trained ML model is claimed.
- The article makes clear that external timing compares against the same capture and that report selection differs from broader rule-level outputs.
- Created `src/content/projects/network-anomaly-detection/assets/dns-comparison.svg` from the three recorded DNS values. New website illustration, not an original project figure; caption and SVG provenance line say so. Linear scale 0–70,000; widths: 23.17, 46.34, 946.54 for values 1,655, 3,310, 67,610 on a 980-unit axis. Includes title/description and detailed image alt text.
- Notebook dependencies are absent in the default Python environment; no fresh dataset execution is claimed. Values were cross-checked against recorded project evidence.
