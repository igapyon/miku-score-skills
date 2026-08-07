# Development Notes

この文書は `mikuscore-skills` の開発メモです。

## 文書の入口

- 設計メモ: [agent-skill-design.md](agent-skill-design.md)

## subtree 運用

`mikuscore` は `vendor/mikuscore/` に `git subtree` で取り込む前提とする。

運用方針:

- `vendor/mikuscore/` は、単一 runtime artifact を受領できるまでの移行用 upstream 保持場所として扱う
- Skill や文書の正式参照先は `vendor/mikuscore/` を優先する
- `workplace/` は仕様検討や一時作業用であり、正式参照先にはしない

## Miku-soft 標準への移行状態

現行の Skill bundle は `vendor/mikuscore` と選別済み Node runtime 依存を同梱する移行状態である。これは現状の実行を保つための暫定形であり、通常の runtime lookup を増やしたり、Skill 側に変換実装を追加したりしない。

bundle 作成では `.DS_Store`、`.mikuscore-build`、`tests/`、`workplace/`、screenshots、CI 設定などの development-only files を除外する。ZIP は `SOURCE_DATE_EPOCH`（未指定時は 2000-01-01 UTC）で timestamp と入力順を固定し、再現可能に作成する。`npm test` は bundle 内容、ZIP hash の二重生成一致、isolated CLI の convert / render / structured diagnostics を確認する。

将来の TOBE は、upstream から `skills/mikuscore/runtime/mikuscore.mjs` を受領し、Java CLI が提供可能になった時点で peer artifact の `mikuscore.jar` を受領する形である。この移行では vendored source tree を bundle から取り除き、package build と upstream source build を分離する。

## 初回取り込み

例:

```bash
git subtree add --prefix=vendor/mikuscore https://github.com/igapyon/mikuscore.git devel --squash
```

## 更新

例:

```bash
git fetch https://github.com/igapyon/mikuscore.git devel
git subtree pull --prefix=vendor/mikuscore https://github.com/igapyon/mikuscore.git devel --squash
```

再発防止チェック:

- `git fetch https://github.com/igapyon/mikuscore.git devel` を先に実行し、`FETCH_HEAD` を明示的に更新してから `git subtree pull` する
- `git log --oneline -n 5 FETCH_HEAD` で upstream `devel` の最新 commit を確認する
- `git log --oneline --decorate -n 5` だけで「取り込み済み」と判断しない。PR merge の内側に subtree sync がぶら下がって見える場合がある
- 取り込み後は `git rev-parse FETCH_HEAD` と subtree pull 後の squash commit メッセージを見比べ、期待した upstream tip まで進んだことを確認する
- さらに `git diff --stat FETCH_HEAD HEAD:vendor/mikuscore` が空であることを確認してから「最新 upstream 取り込み済み」と扱う
- upstream 取り込み前に repo-local `md` 変更がある場合は、先に退避するかコミットして、`fatal: working tree has modifications. Cannot add.` を避ける

最近の取り込みメモ:

- `src/ts/musescore-io.ts` の ES2018 互換化は upstream に入っていたため、そのローカル carry は不要になった
- 最新の subtree sync は 2026-04-18 時点で upstream `devel` tip `2a3df2b8`
- `scripts/lib/load-cli-api.mjs` の compiled-cache と `typescript/bin/tsc` 解決は、現在は vendored upstream 側の内容として入っている
- 2026-04-18 の upstream 取り込みで `vendor/mikuscore/src/ts/cli-api.ts` が upstream 側へ新規追加された
- `src/ts/cli-api.ts` の plain-text decode は、現在は upstream 側で `TextDecoder` ベースの実装になっている
- 2026-04-18 の追加 upstream 取り込みで `abc -> midi` と `MEI` / `LilyPond` の `MusicXML` 相互変換、および関連 CLI 文書とテストが入った
- upstream CLI の現在の説明は `convert` / `render` / `state` 系を前提に読み、`state` では `summarize` / `inspect-measure` / `validate-command` / `apply-command` / `diff` が利用可能
- `state validate-command` / `state apply-command` は `targetNodeId` / `anchorNodeId` に加えて、`selector` / `anchor_selector` を `cli-api.ts` 側で解決できる
- 現在は `vendor/mikuscore/src/ts/cli-api.ts` に repo-local carry は残っていない
- upstream 更新後は `npm --prefix vendor/mikuscore run build` と root `npm run build` の両方で確認する

## ローカル Skill 検証

この手順は OpenAI Codex の repo-local `.codex/skills` 検証フローを前提とする。

このリポジトリでは、repo 直下の `.codex/skills/mikuscore` をローカル検証先として使える。
一般の ABC 作曲や下書きは `mikuscore` を呼ばずに進め、`mikuscore` 固有の変換や handoff を使いたい段階でだけ `mikuscore` を明示する。

開発時の基本フロー:

```bash
npm test
npm run install:local
```

`npm run install:local` は `skills/mikuscore` を `.codex/skills/mikuscore` へ同期する。
このとき `vendor/mikuscore` も `.codex/skills/mikuscore/vendor/mikuscore` として同梱する。
加えて、CLI runtime が孤立環境でも起動できるよう、`vendor/mikuscore/node_modules` から必要な runtime 依存だけを skill 配下へ同梱する。
この同期はローカル検証用の明示操作として扱い、`npm run build` や bundle build の一部には含めない。

`mikuscore` を呼び出した後に生成した曲断片や handoff 用の保存物は、`skills/mikuscore/` ではなく、repo 直下の `mikuscore/` を保存先として扱う。

確認時の前提:

- `~/.codex` ではなく、この repo の `.codex/skills/mikuscore` を検証先にする
- 反映確認は既存セッションではなく、新しい Codex セッションで行う
- `mikuscore` を明示したプロンプトで発火条件を確認する

必要に応じて配布用 bundle も生成する。

```bash
npm run build:bundle
```

配布用 bundle には `skills/mikuscore` 本体に加えて、`skills/mikuscore/vendor/mikuscore` として runtime に必要な `vendor/mikuscore` の選別済み部分を同梱する。
さらに `skills/mikuscore/vendor/mikuscore/node_modules` として、少なくとも `jsdom` と `typescript` を含む runtime 依存を同梱する。
利用側では `bundle/mikuscore-skills/skills/mikuscore` ディレクトリ単体を配置しても self-contained に参照できる状態を前提とする。

配置イメージ:

```text
skills/
  mikuscore/
    SKILL.md
    agents/
    references/
    vendor/
      mikuscore/
        README.md
        src/
        docs/
        scripts/
        node_modules/
```

`npm run build` 系は build と検証に限定し、repo-local `.codex` へのコピーは副作用として実行しない。

## 運用上の注意

- `vendor/mikuscore/` へ直接編集を入れるのは原則避ける
- upstream 仕様確認は `vendor/mikuscore/` を優先する
- `workplace/mikuscore-devel` に差分があっても、それを正式状態とはみなさない
