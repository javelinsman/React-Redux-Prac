import { todoStore } from "./store";
import { toggleTodo, setVisibilityFilter, addTodo } from "./actions";
import { VisibilityFilters } from "./action-types";

console.log(todoStore.getState());

const unsubscribe = todoStore.subscribe(() => console.log(todoStore.getState()));

todoStore.dispatch(addTodo('Learn about actions'));
todoStore.dispatch(addTodo('Learn about reducers'));
todoStore.dispatch(addTodo('Learn about store'));
todoStore.dispatch(toggleTodo(0));
todoStore.dispatch(toggleTodo(1));
todoStore.dispatch(setVisibilityFilter(VisibilityFilters.SHOW_COMPLETED));

unsubscribe();
