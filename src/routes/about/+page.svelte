<script>
    import auth from "$lib/assets/auth.svg"
    import gab from "$lib/assets/gab4.jpg"
    import oli from "$lib/assets/oli.jpg"
    import laurent from "$lib/assets/laurent.jpg"
    import google from "$lib/assets/auth.svg"
    import mediapipe from "$lib/assets/mediapipe.svg"
    import svelte from "$lib/assets/svelte.png"
    import planet from "$lib/assets/planet.png"
</script>

<!-- pt import les images idk -->

<div class="container">
    <div class="sticky m-10 p-5 text-center">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis, fuga repellat. Optio,
        provident distinctio nesciunt eaque quasi laborum earum tempore maxime pariatur quam
        reiciendis? Cum laborum nesciunt molestias. Placeat, alias!
    </div>

    <div class="flex flex-col">
        <div>
            <h1 class="m-10 text-center text-3xl">Notre but!</h1>

            <p class="mx-auto max-w-screen-md text-center text-lg">
                L'objectif principal de CommuPartage est de stimuler la réutilisation d'objets,
                notamment d'outils, afin de réduire la surconsommation. Parallèlement, l'application
                vise à renforcer la solidarité au sein des communautés en facilitant l'entraide
                entre les membres, favorisant ainsi un échange positif et durable au niveau local.
            </p>
        </div>

        <div>
            <h1 class="m-10 text-center text-3xl">Technologies utilisées</h1>
            <div class="grid grid-cols-5 gap-4 p-5">
                <div class=" bg-primary-foreground">
                    <h2 class="mt-4 p-2 text-center">Auth0</h2>
                    <img
                        class="aspect-square w-full object-cover p-8"
                        src={auth}
                        alt=""
                    />
                </div>
                <div class="bg-primary-foreground">
                    <h2 class="mt-4 p-2 text-center">SvelteKit</h2>
                    <img
                        class="aspect-square w-full object-cover p-8"
                        src={svelte}
                        alt=""
                    />
                </div>
                <div class="bg-primary-foreground">
                    <h2 class="mt-4 p-2 text-center">PlanetScale</h2>
                    <img
                        class="aspect-square w-full object-cover p-8"
                        src={planet}
                        alt=""
                    />
                </div>
                <div class="bg-primary-foreground">
                    <h2 class="mt-4 p-2 text-center">MediaPipe</h2>
                    <img
                        class="aspect-square w-full object-cover p-8"
                        src={mediapipe}
                        alt=""
                    />
                </div>
                <div class="bg-primary-foreground">
                    <h2 class="mt-4 p-2 text-center">Google Maps</h2>
                    <img
                        class="aspect-square w-full object-cover p-8"
                        src={google}
                        alt=""
                    />
                </div>
            </div>
        </div>

        <div>
            <h1 class="m-10 text-center text-3xl">Rencontrez les devs</h1>

            <div class="grid grid-cols-3 gap-4 p-5">
                <div>
                    <h2 class="p-2 text-center">Gabriel, Handymen</h2>
                    <img
                        class="aspect-square w-full object-cover p-8"
                        src={gab}
                        alt=""
                    />
                </div>
                <div>
                    <h2 class="p-2 text-center">Laurent, FrontEnd Nerd</h2>
                    <img
                        class="aspect-square w-full object-cover p-8"
                        src={laurent}
                        alt=""
                    />
                </div>
                <div>
                    <h2 class="p-2 text-center">Olivier, Machine Learning Legend</h2>
                    <img
                        class="aspect-square w-full object-cover p-8"
                        src={oli}
                        alt=""
                    />
                </div>
            </div>
        </div>
    </div>
</div>
