<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";

    export let data;
    let video: HTMLVideoElement;

    let width = 0; // We will scale the photo width to this
    let height = 0; // This will be computed based on the input stream

    let canvas: HTMLCanvasElement;

    onMount(() => {
        let s: MediaStream;

        navigator.mediaDevices
            .getUserMedia({ video: true, audio: false })
            .then((stream) => {
                s = stream;
                video.srcObject = stream;
                video.play();
            })
            .catch((err) => {
                console.error(`An error occurred: ${err}`);
            });

        video.addEventListener(
            "canplay",
            (ev) => {
                height = (video.videoHeight / video.videoWidth) * width;
                video.setAttribute("width", `${width}`);
                video.setAttribute("height", "" + height);
                canvas.setAttribute("width", `${width}`);
                canvas.setAttribute("height", "" + height);
            },
            false
        );

        return () => s.getTracks().forEach((t) => t.stop());
    });

    async function takePic() {
        const context = canvas.getContext("2d");
        if (width && height && context) {
            canvas.width = width;
            canvas.height = height;
            context.drawImage(video, 0, 0, width, height);

            const file = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/webp"));
            const res = await fetch(data.signedUrl, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/octet-stream",
                },
                body: await file?.arrayBuffer(),
            });

            if (res.ok) goto("/");
        }
    }
</script>

<main class="container mx-auto grid justify-center gap-4 py-8">
    <h1 class="h1">Création de compte</h1>

    <div class="grid gap-4">
        <video bind:videoWidth={width} bind:this={video} muted>Video stream not available.</video>
        <Button on:click={takePic}>Prendre la photo</Button>
    </div>
</main>

<canvas hidden bind:this={canvas} />
