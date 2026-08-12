# Agent Skill Design

`miku-score-skills` の MVP 向け Agent Skill 設計メモです。

この設計は次の 2 つを主な参照元とする。

- 対象プロダクト: upstream `igapyon/miku-score`
- Skill 設計の参照実装: upstream `igapyon/mikuproject-skills`

補足:

- `miku-score` の実体リポジトリは `igapyon/miku-score` を基準として考える
- ローカルの `workplace/miku-score-devel` は、その仕様検討用の作業コピーとして扱う
- このリポジトリで Skill から安定参照する upstream 本体は `vendor/miku-score` を想定する

## subtree 運用

`miku-score-skills` では、`mikuproject-skills` を参考に `miku-score` を
`vendor/miku-score/` に `git subtree` で取り込む方針を採る。

理由:

- `workplace/` は `.gitignore` 配下であり、正式参照先としては不適切
- Skill の参照元を、このリポジトリ内で安定して閉じたい
- upstream 更新を定型手順で追いやすい
- `mikuproject-skills` の公開運用方針と整合する

運用前提:

- `vendor/miku-score/` は upstream 保持場所として扱う
- 仕様確認や一時検討は `workplace/` でもよいが、正式文書の参照先は `vendor/miku-score/` を優先する
- upstream 更新手順は `docs/development.md` にまとめる

## 方針

MVP では、変換対象ごとに skill を細かく分割しない。
まずは 1 つの `miku-score` skill として成立させる。

理由:

- 利用者から見ると `MusicXML` / `ABC` / `MIDI` / `MuseScore` の変換は 1 つの往復フローとして理解されやすい
- `miku-score` の中核方針は format ごとの個別 UI ではなく `MusicXML-first` の変換パイプラインである
- 初期段階で skill を分けすぎると、対象 format 判定、会話状態、handoff 文脈が複雑になる

## MVP Skill の責務

Skill は次の責務を担当する。

- `miku-score` 固有の変換ワークフローを案内する
- 入力 format と出力 format を判定し、適切な変換経路を選ぶ
- 必要に応じて `MusicXML` を内部の正規基軸として扱う
- 生成 AI との会話境界では、現行方針として `ABC` を優先的に扱う
- `ABC` の対応基準は current documented baseline として `ABC standard 2.2` を明示する
- 変換結果と診断情報の扱いを整理する
- `miku-score` の仕様に沿って、破壊的な説明や不正確な案内を避ける

Skill は譜面浄書アプリや汎用 DAW の代替を目指さない。
MVP の責務は、`miku-score` に即した structured workflow と format conversion の会話誘導を安定させることである。

## Skill 名称

正式 Agent Skill identity:

- `igapyon-miku-score`

正式 trigger:

- `miku-score`
- `miku-score-skills`

候補理由:

- upstream 名と一致していて理解しやすい
- `miku-score` 固有の変換・診断・MusicXML-first 方針を扱う skill であることが明確

代替候補:

- `miku-score-convert`
- `miku-score-musicxml`

MVP では installed skill identity として `igapyon-miku-score`、会話上の
正式 trigger として `miku-score` を採用する想定とする。

## 想定する利用シーン

### 1. Format 変換の相談

- 利用者が `miku-score` を明示して変換を依頼する
- Skill が入力と出力の format を整理する
- Skill が `miku-score` に適した変換経路を案内する
- 必要なら intermediate として `MusicXML` を明示する

### 2. 変換結果の診断

- 利用者が warning や loss の理由を知りたい
- Skill が `miku-score` の診断方針に沿って説明する
- 必要なら `miku-score` が保持・非保持をどう扱うかを整理する

### 3. AI handoff

- 利用者が外部 AI や他ツールへ渡すための score 表現を知りたい
- Skill が current policy として、生成 AI 向け full-score handoff には `ABC` を案内する
- canonical source としての `MusicXML` と、AI-facing interchange としての `ABC` を区別して整理する

### 4. CLI / build / local workflow の参照

- 利用者が `miku-score` の CLI や build 手順を知りたい
- Skill が `README` と `docs/spec/*` に沿って案内する
- 未実装や experimental な範囲は明確に区別する

## 中核設計前提

`miku-score` skill は、`miku-score` の次の前提を壊してはならない。

- `MusicXML-first` の変換パイプライン
- current generative-AI full-score handoff は `ABC`
- 既存 `MusicXML` の保持を最優先
- 最小 structural modification
- round-trip stability の重視
- loss は診断情報や metadata で追跡する方針
- browser-based / single-file distribution であること

Skill の説明や workflow は、これらの前提に反しないことを優先する。

## 状態管理方針

MVP では、Agent Skill の内部説明基軸は `MusicXML` を優先する。

理由:

- `miku-score` 自体が canonical source として `MusicXML` を明示している
- README と仕様文書で `MusicXML` が基軸 format として扱われている
- 他 format 間の変換でも、会話上の説明軸として `MusicXML` が最も整合的である

補足:

- `ABC` は AI interaction 上の current adopted handoff 形式である
- `MIDI` / `MuseScore` / `VSQX` / `MEI` / `LilyPond` は用途別の I/O として扱う
- 生成 AI への full-score handoff や新規生成では `ABC` を優先する
- 会話境界で常に全文 `MusicXML` を保持するとは限らないが、内部説明上の正規基軸は `MusicXML` とする

基本変換フロー:

- text / file input -> source format parse -> `MusicXML`-centric transform -> target format export
- 既存 `MusicXML` 編集 -> minimal patch -> save
- diagnostics が必要な場合 -> conversion result と併せて warning / limitation を返す

## upstream 仕様の利用方針

MVP では、次の文書群を主要な規範とする。

- `vendor/miku-score/README.md`
- `vendor/miku-score/docs/spec/SPEC.md`
- `vendor/miku-score/docs/spec/ARCHITECTURE.md`
- `vendor/miku-score/docs/spec/DIAGNOSTICS.md`
- `vendor/miku-score/docs/spec/ABC_IO.md`
- `vendor/miku-score/docs/spec/MIDI_IO.md`
- `vendor/miku-score/docs/spec/MUSESCORE_IO.md`
- `vendor/miku-score/docs/AI_INTERACTION_POLICY.md`

優先順位:

1. `docs/spec/*` の規範的な記述
2. `README.md` の現行説明
3. 将来メモや TODO

仕様が衝突した場合は、`docs/spec/*` を優先する。

## 操作単位

MVP では、Skill の責務を次の操作単位として定義する。

### `convert`

入力:

- source format
- target format
- 必要なら score data または file path

出力:

- 想定される変換経路
- 変換可否の判断
- 注意点
- 必要なら `MusicXML` intermediate の説明

### `diagnostics`

入力:

- 変換時または保存時の warning / error
- score structure に関する相談

出力:

- 問題の意味
- `miku-score` 上の扱い
- hard error か soft warning かの整理
- 必要なら回避策

### `format-guidance`

入力:

- 利用者の目的
- 対象 format

出力:

- `miku-score` でその format をどう扱うべきか
- `MusicXML` を基軸にするべきか
- AI-facing handoff では `ABC` を選ぶべきか
- experimental 対応かどうか

### `ai-handoff`

入力:

- 生成 AI と score をやり取りしたい要求
- handoff 用の format 選択

出力:

- current policy として `ABC` を優先する説明
- canonical `MusicXML` と AI-facing `ABC` の役割分離
- JSON interface が deferred future work であることの整理

### `workflow`

入力:

- CLI / build / test / local development に関する要求

出力:

- 実行コマンド
- 参照すべき文書
- 実装済み範囲と未確定範囲

## 会話上の取り扱い

Skill は次のように振る舞う。

- `miku-score` が明示されたときに opt-in で発火する
- 汎用的な音楽理論質問や一般的な譜面編集相談だけでは自動発火しない
- format 名が複数ある場合は、まず source / target を整理する
- format 変換では `MusicXML` を中核説明軸として扱う
- 生成 AI handoff では `ABC` を優先して扱う
- unsupported / experimental / non-goal を明確に区別する

利用者が format 名を明示しなくても、中身から判定できる場合は判定する。
判定不能なら短く確認する。

## 発火条件

第一候補の発火条件:

- 利用者が `miku-score` と明示する
- 利用者が `MusicXML-first` の `miku-score` 変換フローを求める
- 直前まで `miku-score` 文脈が継続している

自動発火を避ける条件:

- 単なる一般的な作曲相談
- 一般的な MIDI 編集相談
- 汎用的な XML 説明
- `ABC` や `MIDI` という単語だけが出ている会話

`miku-score` skill は opt-in を基本とする。

## hard error と soft warning

Skill は次のものを hard error として扱う。

- source format / target format が判定不能
- `miku-score` の現行スコープ外の変換を、あたかも実装済みであるかのように扱う要求
- 仕様文書に反する断定

Skill は次のものを soft warning として扱う。

- experimental format に関する制約
- round-trip loss の可能性
- diagnostic metadata の付与や保持に関する注意
- CLI の今後拡張予定だが現時点では未安定な項目

## handoff 型と agent-to-agent 型

MVP の現在設計は handoff 型を基本とする。

これは、skill が変換方針、format guidance、diagnostics 解釈を返し、
その返却内容を利用者または上位エージェントが次の処理に使う形を意味する。

たとえば `convert` では、skill 自身が必ずしも変換を実行するのではなく、
どの format pair が妥当で、何を中間表現として扱うべきかを返す。

一方で、将来は agent-to-agent 型もありうる。

これは、上位エージェントが内部的に `miku-score` CLI や変換 API を呼び、
中間の説明を画面に出しすぎずに処理する方式である。

MVP ではまず、仕様に忠実な conversation contract を固めることを優先する。

## agent-to-agent 型へ進める場合の拡張方針

将来 agent-to-agent 型へ進める場合は、skill 本体だけで完結させるより、
上位エージェントまたは CLI 連携側で吸収する方が整合的である。

理由:

- `miku-score` 自体は browser-based product であり、UI と Core の責務分離が強い
- format conversion と diagnostic interpretation を skill に閉じ込めすぎると、実行環境差分を抱えやすい
- CLI の段階的拡張が README / TODO に明示されている

### 推奨アーキテクチャ

役割は次のように分ける。

- `miku-score` skill
  - format pair を整理する
  - `MusicXML-first` 方針を守る
  - diagnostics と制約を説明する
  - handoff / workflow guidance を返す
- `miku-score` CLI
  - `convert`
  - `render svg`
  - 今後の I/O 拡張
- 上位エージェント
  - 利用者要求を受ける
  - source / target / state を整理する
  - 必要なら CLI 実行や file workflow に接続する

## Skill 構成案

`mikuproject-skills-devel` を参考に、`miku-score-skills` でも次の構成を想定する。

- `docs/agent-skill-design.md`
  - 設計メモ
- `skills/igapyon-miku-score/SKILL.md`
  - 発火条件
  - core rules
  - operations
- `skills/igapyon-miku-score/references/INDEX.md`
  - 詳細の入口
- `skills/igapyon-miku-score/references/workflow/*`
  - active workflow
  - conversion flow
  - diagnostics handling
- `skills/igapyon-miku-score/references/io/*`
  - `musicxml`
  - `abc`
  - `midi`
  - `musescore`
- `skills/igapyon-miku-score/references/runtime/*`
  - operations map
  - upstream map

## 初期実装で決めたいこと

次の点は、Skill 実装前に決めておくとよい。

- `miku-score` skill をどの程度 opt-in にするか
- `convert` を中心 operation にするか
- `render svg` を MVP に含めるか
- `ABC` を AI handoff 上の特別扱いにするか
- experimental format を Skill でどこまで積極的に案内するか
- diagnostics を会話でどこまで詳述するか

## 非目標

MVP では次を非目標とする。

- `miku-score` browser UI の完全代替
- 高度な浄書機能の一般論
- `miku-score` 非依存の汎用楽譜変換論
- 実装されていない format pair を実装済みのように見せること
- 仕様文書にない自動補正をあるように説明すること
