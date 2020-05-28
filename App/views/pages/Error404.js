let Index = {
    render: async () => {
        let view =  /*html*/`
        <body>
            <main>
            <div id="not404">I cannot find anything by this route. Go away stranger!</div>
            </main>
        </body>
        `
        return view
    },
    after_render: async () => {
    }
}

export default Index;