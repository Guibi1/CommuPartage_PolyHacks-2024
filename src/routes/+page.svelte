<script lang="ts">
    import { PUBLIC_GOOGLE_MAPS_KEY } from "$env/static/public";
    import { Button } from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card";
    import { onMount } from "svelte";

    import { goto } from "$app/navigation";
    import { page } from "$app/stores";

    const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789abcdefghijklmnopqrstuvwxyz";
    export let data;
    let mapDiv: Element;

    $: selected = $page.url.searchParams.get("selected");

    onMount(async () => {
        const { Loader } = await import("@googlemaps/js-api-loader");
        const { MarkerClusterer } = await import("@googlemaps/markerclusterer");

        const loader = new Loader({
            apiKey: PUBLIC_GOOGLE_MAPS_KEY,
            version: "weekly",
            libraries: ["maps", "marker"],
        });

        const { Map } = await loader.importLibrary("maps");
        const { AdvancedMarkerElement, PinElement } = await loader.importLibrary("marker");

        const markers = data.objects.map(({ position, id }, i) => {
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

            marker.addListener("click", () => goto(`?selected=${id}`));
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

<main class="container flex flex-1 flex-col overflow-hidden py-8">
    <div class="mb-4 flex items-center justify-between">
        <h1 class="h1">Articles à louer</h1>

        {#if data.user}
            <Button href="/new">Afficher un article</Button>
        {/if}
    </div>

    <div class="grid flex-1 gap-8 overflow-hidden lg:grid-cols-3">
        <div class="col-span-2 my-4 hidden rounded-xl bg-primary p-4 lg:grid">
            <div class="rounded-lg" bind:this={mapDiv} />
        </div>

        <div class="flex h-full flex-col gap-4 overflow-y-auto p-4">
            {#each data.objects as object, i}
                <a href={`?selected=${object.id}`}>
                    <Card.Root
                        class={`grid grid-cols-2 ${object.id === selected ? "ring-4 ring-primary" : ""}`}
                    >
                        <div class="flex flex-col justify-between">
                            <Card.Header>
                                <Card.Title>
                                    <span class="text-muted-foreground">
                                        {labels[i]}.
                                    </span>
                                    {object.name}
                                </Card.Title>
                                <Card.Description>{object.category}</Card.Description>
                            </Card.Header>

                            <Card.Footer>
                                <Button href={`/profile/${object.owner_id}`}>Savoir plus</Button>
                            </Card.Footer>
                        </div>

                        <div class="p-6 pl-0">
                            <img
                                src={`https://storage.googleapis.com/commupartage_object_images/${object.id}`}
                                alt="L'objet à louer"
                                class="h-40 rounded-lg border object-cover"
                            />
                        </div>
                    </Card.Root>
                </a>
            {/each}
        </div>
    </div>
</main>
