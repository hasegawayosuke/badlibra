# BadLibra - 脆弱性を試すためのサンプルWebアプリケーション

----

*THIS PROJECT IS DEPRECATED*

*Use [BadLibrary](https://github.com/SecureSkyTechnology/BadLibrary) instead. *

----

BadLibraは初めて脆弱性を探すのに最適な、小さくて簡単に動かせる脆弱なサンプルWebアプリケーションです。
node.jsだけ入っていれば特にそれ以外には何も必要なく動くので、BadStoreなどのようにVM環境を用意する必要もありません。

# インストール

    % git clone https://github.com/hasegawayosuke/badlibra.git
    % npm install

# 起動

単純に app.js を起動するだけです。デフォルトでは8080でlistenします。

    % npm start 

または

    % node app.js

で起動するので、Webブラウザで `http://127.0.0.1:8080` などへアクセスしてください。

引数としてポート番号を指定するとそのポートでlistenします。

    % node app.js 80


# 含まれる脆弱性

- 貸し出し履歴のパラメータqでSQLインジェクション
- 貸し出し履歴のパラメータdでXSS
- お問合せ画面でCSRF


