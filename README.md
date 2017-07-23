# minecraft-lifter

Web UI of Minecraft instance powered by Google Cloud Platform

![](https://i.imgur.com/FstIMLC.jpg)

----

# これis何

- GCPのインスタンスを起動したり停止したりできる
- おおむねMinecraft向け
- マルチドメイン対応。1サーバーでも複数ドメインを捌ける

## メリット

- GCPは10分以上1分単位の課金なので、ユーザーがログインしていないインスタンスを止めることで月の負担が安くなる

## デメリット

- 遊ぶときはユーザーに手動で起動してもらわないとならない
- 今の所認証機構なし（Basic認証とか使ってください）

# 使い方

1. 適当なサーバーを用意する
2. DNSのAレコードとかAAAAレコードを1のサーバーに向ける
3. `yarn`
4. GCPの認証JSONを`/path/to/minecraft-lifter/gce/auth/`に置く
5. `/path/to/minecraft-lifter/config/minecraft.js`を自分の環境に合わせて編集する
   ```
   'controlpanel.minecraft.example.com': {      //minecraft-lifterを置いたドメイン
     minecraft: {
       server: 'minecraft.example.com',         //minecraftサーバーが動いているインスタンスのドメイン（IPアドレスでも可）
       port: 25565,                             //minecraftサーバーが待ち受けているポート
     },
     gce: {
       projectId: 'minecraft-174003',           //GCPのプロジェクトID
       authJson: 'Minecraft-6b3a286872dd.json', //GCPの認証JSONファイル名
       zone: 'asia-northeast1-a',               //GCEインスタンスのゾーン
       instanceId: 'minecraft-example-com',     //GCEインスタンスID
       shutdownMinutes: 15,                     //0ユーザー継続が何分続いたらシャットダウンするか
       owner: {
         name: '@mohemohe',                     //鯖管の名前
         url: 'https://twitter.com/mohemohe',   //鯖管の連絡先
       },
     }
   },
   ```
6. nginxの設定をSailsに向ける  
   ```
   location / {
       proxy_http_version                 1.1;
       proxy_set_header  Upgrade          $http_upgrade;
       proxy_set_header  Connection       "upgrade";
       proxy_set_header  Host             $host;
       proxy_set_header  X-Forwarded-For  $proxy_add_x_forwarded_for;
       proxy_set_header  X-Real-IP        $remote_addr;
       proxy_pass                         http://127.0.0.1:1337;
   }
   ```
7. `pm2 start /path/to/minecraft-lifter/pm2.json`
8. イェイ！

# 免責事項

バグでインスタンスが止まらなくて課金が高額になっても責任は取りません  
あとはMIT/X11ライセンスで
