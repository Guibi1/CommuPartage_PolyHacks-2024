<script lang="ts">
    import * as Form from "$lib/components/ui/form";
    import type { PageData } from "./$types";
    import { newObjectSchema } from "./newObjectSchema";

    export let data: PageData;
    let loading = false;
    $: console.log("🚀 ~ loading:", loading);

    const onSubmit = async ({
        formData,
        controller,
    }: {
        formData: FormData;
        controller: AbortController;
    }) => {
        // Upload file
        const file = formData.get("file")?.valueOf() as File;

        try {
            loading = true;
            const res = await fetch(data.signedUrl, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/octet-stream",
                },
                body: await file.arrayBuffer(),
            });

            if (res.ok) {
                formData.set("id", data.id);
                formData.set("image", data.signedUrl);
                console.log("SUCCESS");
            } else {
                console.error("PUT failed", res);
                controller.abort();
                loading = false;
            }
        } catch (err) {
            console.error(err);
            controller.abort();
            loading = false;
        }
    };
</script>

<main class="p container my-8 max-w-screen-sm">
    <h1 class="mb-4 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Prêter un objet
    </h1>

    <Form.Root
        class="flex flex-col gap-2"
        method="POST"
        enctype="multipart/form-data"
        form={data.form}
        schema={newObjectSchema}
        let:config
        options={{
            onSubmit,
            onResult() {
                loading = false;
            },
        }}
    >
        <Form.Field {config} name="id">
            <Form.Item hidden>
                <Form.Input hidden readonly value={data.id} />
            </Form.Item>
        </Form.Field>

        <Form.Field {config} name="name">
            <Form.Item>
                <Form.Label>Name</Form.Label>
                <Form.Input />
                <Form.Validation />
            </Form.Item>
        </Form.Field>

        <Form.Field {config} name="value">
            <Form.Item>
                <Form.Label>Value</Form.Label>
                <Form.Input type="number" />
                <Form.Description></Form.Description>
                <Form.Validation />
            </Form.Item>
        </Form.Field>

        <Form.Field {config} name="file">
            <Form.Item>
                <Form.Label>Photo de l'object</Form.Label>
                <Form.Input type="file" />
                <Form.Description></Form.Description>
                <Form.Validation />
            </Form.Item>
        </Form.Field>

        <Form.Button disabled={loading} class="mt-4">Submit</Form.Button>
    </Form.Root>
</main>
