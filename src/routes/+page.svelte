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

        const { Map } = await loader.importLibrary("maps");
        const { AdvancedMarkerElement, PinElement } = await loader.importLibrary("marker");

        // Create an array of alphabetical characters used to label the markers.
        const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789abcdefghijklmnopqrstuvwxyz";

        const markers = data.objects.map(({ position }, i) => {
            if (!position.lat || !position.lng) return;
            const label = labels[i % labels.length];
            const pinGlyph = new PinElement({
                glyph: label,
                glyphColor: "white",
            });
            const marker = new AdvancedMarkerElement({
                position,
                content: pinGlyph.element,
            });

            // markers can only be keyboard focusable when they have click listeners
            // open info window when marker is clicked
            marker.addListener("click", () => {});
            return marker;
        });
        // Add a marker clusterer to manage the markers.

        let map = new Map(mapDiv, {
            zoom: 14,
            center: { lat: 45.5048442, lng: -73.6184641 },
            mapId: "DEMO_MAP_ID",
            disableDefaultUI: true,
        });
        new MarkerClusterer({ markers, map });
    });
</script>

<main class="container flex flex-col overflow-hidden py-8">
    <div class="mb-4 flex items-center justify-between">
        <h1 class="h1">Articles à louer</h1>

        {#if data.user}
            <Button href="/new">Afficher un article</Button>
        {/if}
    </div>

    <div class="grid gap-8 overflow-hidden lg:grid-cols-3">
        <div class="col-span-2 hidden rounded-xl bg-primary p-4 lg:grid">
            <div class="rounded-lg" bind:this={mapDiv} />
        </div>

        <div class="my-4 flex h-full flex-col gap-2 overflow-y-auto">
            {#each data.objects as object}
                <Card.Root class="grid grid-cols-2">
                    <div class="flex flex-col justify-between">
                        <Card.Header>
                            <Card.Title>{object.name}</Card.Title>
                            <Card.Description>{object.category}</Card.Description>
                        </Card.Header>

                        <Card.Footer>
                            <Button href={`/profile/${object.owner_id}`}>Savoir plus</Button>
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
