import { bind, html, repeat } from "@microsoft/fast-element";
import { twoWay } from "@microsoft/fast-element/binding/two-way";
import type { TodoApp } from "./todo-app.js";
import type { Todo } from "./todo-list.js";
import "./todo-form.js";

export const template = html<TodoApp>`
    <h1>FAST Todos</h1>

    <todo-form></todo-form>

    <section>
        <label for="filter">Filter:</label>
        <select
            name="filter"
            title="filter"
            :value=${bind(x => x.todos.activeFilter, twoWay)}
        >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
        </select>
    </section>

    <ul class="todo-list">
        ${repeat(
            x => x.todos.filtered,
            html<Todo, TodoApp>`
                <li class="todo">
                    <input type="checkbox" :checked=${bind(x => x.done, twoWay)} />
                    <span class="description ${x => (x.done ? "done" : "")}">
                        ${x => x.description}
                    </span>
                    <button
                        @click=${(x, c) => c.parent.todos.remove(x)}
                        aria-label="Remove item"
                    >
                        &times;
                    </button>
                </li>
            `
        )}
    </ul>
`;
