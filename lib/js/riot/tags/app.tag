<app>
    <div>
        <common-header/>
        <main>
            <div class="row">
                <common-leftnav class="col s3"/>

                <route class="col s9"/>
            </div>
        </main>
        <common-footer/>
    </div>

    <style>
        app > div {
            display: flex;
            min-width: 1024px;
            width: 100vw;
            min-height: 100vh;
            flex-direction: column;
        }
        main {
            flex: 1 0 auto;
        }

        main > div.row {
            margin: 20px 0 !important;
        }
    </style>

    <script>
        riot._event = riot.observable();
    </script>
</app>