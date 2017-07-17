<manage-dashboard>
    <h4>ダッシュボード</h4>
    <hr>
    <h5>ステータス: { overrideStatus !== null ? overrideStatus : status === null ? '読み込み中...' : status.success ? '起動' : '停止' }</h5>

    <button data-target="startInstanceModal" class="waves-effect waves-light btn { overrideStatus !== null ? 'disabled' : status === null ? 'disabled' : status.success ? 'disabled' : 'enabled' }">
        <i class="material-icons left">cloud</i>インスタンス起動
    </button>
    <button data-target="stopInstanceModal" class="waves-effect waves-light btn { overrideStatus !== null ? 'disabled' : status === null ? 'disabled' : status.success ? 'enabled' : 'disabled' }">
        <i class="material-icons left">cloud</i>インスタンス停止
    </button>

    <h5>サーバー情報:</h5>
    <table class="bordered" if={ status.success }>
        <thead>
            <tr>
                <th>key</th>
                <th>value</th>
            </tr>
        </thead>

        <tbody>
            <tr each={ value, key in status.result }>
                <td>{ key }</td>
                <td>{ value }</td>
            </tr>
        </tbody>
    </table>

    <div id="startInstanceModal" class="modal">
        <div class="modal-content">
            <h4>確認</h4>
            <p>Minecraftインスタンスを起動します。</p>
            <p>
                インスタンスの起動を行うことにより、 $0.01 / hour の課金が <a href="https://twitter.com/mohemohe" target="_blank">@mohemohe</a> に発生します。<br>
                このインスタンスは、最短1分、最長24時間で停止する、プリエンプティブインスタンスです。<br>
                Google Cloud Platformの制約により、予告なく停止する場合があります。
            </p>

            <p>
                Minecraft内でキャラクターが10分以上動かなかった場合はサーバーからキックされます。<br>
                また、ログインユーザー数が0人のまま15分経過した場合、インスタンスは自動的に停止します。
            </p>
        </div>
        <div class="modal-footer">
            <button class="modal-action modal-close waves-effect waves-green btn-flat">Cancel</button>
            <button class="modal-action modal-close waves-effect waves-green btn-flat" onclick={ startInstance }>OK</button>
        </div>
    </div>

    <div id="stopInstanceModal" class="modal">
        <div class="modal-content">
            <h4>確認</h4>
            <p>Minecraftインスタンスを停止します。</p>
        </div>
        <div class="modal-footer">
            <button class="modal-action modal-close waves-effect waves-green btn-flat">Cancel</button>
            <button class="modal-action modal-close waves-effect waves-green btn-flat" onclick={ stopInstance }>OK</button>
        </div>
    </div>

    <script>
        const self = this;
        self.updateMinecraftServerStatusHandler = null;
        self.status = null;
        self.overrideStatus = null;

        getCsrf() {
            return fetch(`${window.location.origin}/csrfToken`)
            .then(response => { return response.json(); })
            .then(json => { return json._csrf; });
        }

        startInstance() {
            Materialize.toast('インスタンス起動リクエストを送信しました', 10 * 1000);
            return fetch(`${window.location.origin}/server/state`,
            {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({
                    state: 'start',
                }),
            }).then(response => {
                if(!response.ok) {
                    Materialize.toast('インスタンス起動リクエストが失敗しました', 10 * 1000);
                    return { success: false };
                }
                return response.json();
            }).then(json => {
                if(json.success) {
                    Materialize.toast('インスタンス起動リクエストが成功しました', 10 * 1000);
                } else {
                    Materialize.toast('インスタンス起動リクエストが失敗しました', 10 * 1000);
                }
            });
        }

        stopInstance() {
            Materialize.toast('インスタンス停止リクエストを送信しました', 10 * 1000);
            self.overrideStatus = '停止中...';
        }

        getMinecraftServerStatus() {
            return fetch(`${window.location.origin}/minecraft/status`).then(response => {
                if(!response.ok) {
                    Materialize.toast('サーバー情報の取得に失敗しました', 10 * 1000);
                    return { success: false };
                }
                return response.json();
            });
        }

        updateMinecraftServerStatus() {
            self.getMinecraftServerStatus().then(status => {
                self.status = status;
                if(status.success) {
                    self.status.result.player = self.status.result.player_.join(", ");
                    delete self.status.result.sessionId;
                    delete self.status.result.from;
                    delete self.status.result.player_;
                }

                self.update();
            });
        }

        startUpdateMinecraftStatus() {
            if(self.updateMinecraftServerStatusHandler ===  null) {
                self.updateMinecraftServerStatusHandler = setInterval(self.updateMinecraftServerStatus, 5000);
            }
        }

        stopUpdateMinecraftStatus() {
            if(self.updateMinecraftServerStatusHandler !== null) {
                clearInterval(self.updateMinecraftServerStatusHandler);
            }
        }

        this.on('mount', () => {
            $('.modal').modal();
            self.startUpdateMinecraftStatus();
        });

        this.on('unmount', () => {
            self.stopUpdateMinecraftStatus();
        });

    </script>
</manage-dashboard>