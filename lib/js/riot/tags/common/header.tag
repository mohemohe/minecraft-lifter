<common-header>
    <div>
        <nav>
            <div class="nav-wrapper teal darken-1">
                <span class="brand-logo">Minecraft Lifter</span>
            </div>
        </nav>
    </div>

    <style>
        .brand-logo {
            margin-left: 1em;
        }
    </style>

    <script>
        riot._event.on('UPDATE_SERVER_STATUS', function(obj) {
            console.log(obj);
        });
    </script>
</common-header>