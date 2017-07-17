<app>
    <div>
        <common-header/>
        <main>
            <common-leftnav id="leftnav"/>

            <route id="content"/>
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
            overflow-x: hidden;
        }
        main {
            display: flex;
            flex: 1 0 auto;
        }

        #content {
            flex: 1;
            padding: 0 20px;
        }
    </style>

    <script>
        riot._event = riot.observable();
    </script>
</app>