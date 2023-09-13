import {renderToString} from 'react-dom/server'

const server = Bun.serve({
    hostname: "localhost",
    port: 8000,
    fetch: fetchHandler,
})

console.log(`Bun todo running on ${server.hostname}:${server.port}`)

type Todo = { id: number; name: string; }
const todos: Todo[] = []

async function fetchHandler(request: Request): Promise<Response>{
    const url = new URL(request.url)

    if(url.pathname === "" || url.pathname === "/"){
        return new Response(Bun.file("index.html"))
    }

    if(url.pathname === "/todos" && request.method === "GET"){
        return new Response(renderToString(<TodoList todos={todos} />))
    }

    if(url.pathname === "/todos" && request.method === "POST"){
        console.log('here')    
        const {todo} = await request.json()
            todos.push({
                id: todos.length + 1,
                name: todo,
            })
        return new Response(renderToString(<TodoList todos={todos} />))
    }

    return new Response("Not found", { status: 404 });
}

function TodoList(props: { todos: Todo[] }){
    return (
        <ul>
        {props.todos.length 
            ? props.todos.map(todo => <li>{todo.name}</li>) 
            : "Todo not found"}
        </ul>
    );
}
