<script lang="ts">
    import { PUBLIC_GOOGLE_MAPS_KEY } from "$env/static/public";
    import { Button } from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card";
    import { onMount } from "svelte";

    import { Loader } from "@googlemaps/js-api-loader";
    import { MarkerClusterer } from "@googlemaps/markerclusterer";

    export let data;
    let mapDiv: Element;

    onMount(async () => {
        const loader = new Loader({
            apiKey: PUBLIC_GOOGLE_MAPS_KEY,
            version: "weekly",
            libraries: ["maps", "marker"],
        });

        const { Map, InfoWindow } = await loader.importLibrary("maps");
        const { AdvancedMarkerElement, PinElement } = await loader.importLibrary("marker");

        // Create an array of alphabetical characters used to label the markers.
        const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        const infoWindow = new InfoWindow({
            content: "",
            disableAutoPan: true,
        });

        const markers = locations.map((position, i) => {
            const label = labels[i % labels.length];
            const pinGlyph =new  PinElement({
                glyph: label,
                glyphColor: "white",
            });
            const marker = new AdvancedMarkerElement({
                position,
                content: pinGlyph.element,
            });

            // markers can only be keyboard focusable when they have click listeners
            // open info window when marker is clicked
            marker.addListener("click", () => {
                infoWindow.setContent(position.lat + ", " + position.lng);
                infoWindow.open(map, marker);
            });
            return marker;
        });
        // Add a marker clusterer to manage the markers.

        let map = new Map(mapDiv, {
            zoom: 3,
            center: { lat: -28.024, lng: 140.887 },
            mapId: 'DEMO_MAP_ID',
        });
        new MarkerClusterer({ markers, map });
    });

    const locations = [
        { lat: -31.56391, lng: 147.154312 },
        { lat: -33.718234, lng: 150.363181 },
        { lat: -33.727111, lng: 150.371124 },
        { lat: -33.848588, lng: 151.209834 },
        { lat: -33.851702, lng: 151.216968 },
        { lat: -34.671264, lng: 150.863657 },
        { lat: -35.304724, lng: 148.662905 },
        { lat: -36.817685, lng: 175.699196 },
        { lat: -36.828611, lng: 175.790222 },
        { lat: -37.75, lng: 145.116667 },
        { lat: -37.759859, lng: 145.128708 },
        { lat: -37.765015, lng: 145.133858 },
        { lat: -37.770104, lng: 145.143299 },
        { lat: -37.7737, lng: 145.145187 },
        { lat: -37.774785, lng: 145.137978 },
        { lat: -37.819616, lng: 144.968119 },
        { lat: -38.330766, lng: 144.695692 },
        { lat: -39.927193, lng: 175.053218 },
        { lat: -41.330162, lng: 174.865694 },
        { lat: -42.734358, lng: 147.439506 },
        { lat: -42.734358, lng: 147.501315 },
        { lat: -42.735258, lng: 147.438 },
        { lat: -43.999792, lng: 170.463352 },
    ];
</script>

<main class="container py-8">
    <div class="mb-4 flex justify-between">
        <h1 class="h1">Articles à louer</h1>

        {#if data.user}
            <Button href="/new">Create object</Button>
        {/if}
    </div>

    <div class="grid grid-cols-3">
        <div class="col-span-2 grid aspect-square rounded-xl border-4 border-primary">
            <div class="rounded-lg" bind:this={mapDiv}></div>
        </div>

        <div class="m-4 flex flex-col gap-2">
            {#each data.objects as object}
                <Card.Root class="grid grid-cols-2">
                    <div>
                        <Card.Header>
                            <Card.Title>{object.name}</Card.Title>
                            <Card.Description>{object.category}</Card.Description>
                        </Card.Header>

                        <Card.Footer>
                            <Button>Louer</Button>
                        </Card.Footer>
                    </div>

                    <div class="p-6 pl-0">
                        <img
                            src={`https://storage.googleapis.com/commupartage_object_images/${object.image}`}
                            alt="L'objet à louer"
                            class="h-40 rounded-lg border object-cover"
                        />
                    </div>
                </Card.Root>
            {/each}
        </div>
    </div>
</main>
