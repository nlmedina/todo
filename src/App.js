import { useState, useEffect, Fragment } from 'react';
import { v4 as uuidv4 } from 'uuid';

import './App.css';

const initialTodos = [
  { id: uuidv4(), done: true, title: 'Clean yard' },
  { id: uuidv4(), done: false, title: 'Fix kitchen lights' },
  {
    id: uuidv4(),
    done: false,
    title: 'Buy groceries',
    todos: [
      {
        id: uuidv4(),
        done: false,
        title: 'Bread',
      },
      {
        id: uuidv4(),
        done: true,
        title: 'Orange',
      },
      {
        id: uuidv4(),
        done: false,
        title: 'Bathroom supplies',
        todos: [
          {
            id: uuidv4(),
            done: false,
            title: 'Shampoo',
          },
          {
            id: uuidv4(),
            done: false,
            title: 'Soap',
          },
        ],
      },
    ],
  },
];

function App() {
  const [todos, setTodos] = useState(initialTodos);
  const [isAdding, setIsAdding] = useState(false);
  const [draftAdd, setDraftAdd] = useState('');

  const deleteSubTodo = (id) => {
    return () => {
      setTodos((currentTodos) => {
        return currentTodos.filter((t) => {
          return t.id !== id;
        });
      });
    };
  };

  return (
    <div className="App">
      <h1>To-do application</h1>
      {todos.map((todo) => {
        return (
          <Todo
            key={todo.id}
            {...todo}
            ancestorIds={[]}
            handleDelete={deleteSubTodo(todo.id)}
          />
        );
      })}
      {!isAdding ? (
        <button
          type="button"
          onClick={() => {
            setIsAdding(true);
          }}
        >
          +
        </button>
      ) : null}
      {isAdding ? (
        <div>
          <input
            type="text"
            onChange={(e) => {
              setDraftAdd(e.target.value);
            }}
          />
          <button
            type="button"
            onClick={() => {
              setTodos((t) => {
                return [...t, { title: draftAdd, done: false, id: uuidv4() }];
              });
              setIsAdding(false);
            }}
          >
            Add
          </button>
        </div>
      ) : null}
    </div>
  );
}

const Todo = ({
  id,
  title,
  done,
  todos: initialTodos = [],
  ancestorIds,
  handleDelete,
  undoParent = () => {},
}) => {
  const [state, setState] = useState({ title, done });
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const [draftEdit, setDraftEdit] = useState(title);
  const [draftAdd, setDraftAdd] = useState('');

  const [todos, setTodos] = useState(initialTodos);

  const deleteSubTodo = (id) => {
    return () => {
      setTodos((currentTodos) => {
        return currentTodos.filter((t) => {
          return t.id !== id;
        });
      });
    };
  };

  const undoFromChild = () => {
    setState((s) => ({ ...s, done: false }));
  };

  useEffect(() => {
    if (done) {
      setState((s) => ({ ...s, done: true }));
    }
  }, [done]);

  useEffect(() => {
    setDraftAdd('');
  }, [isAdding]);

  useEffect(() => {
    setDraftEdit(state.title);
  }, [isEditing, state.title]);

  useEffect(() => {
    if (state.done === false) {
      undoParent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.done]);

  return (
    <div>
      <div className="todo-container">
        {isEditing ? (
          <div>
            <input
              type="text"
              value={draftEdit}
              onChange={(e) => {
                setDraftEdit(e.target.value);
              }}
            />
            <button
              type="button"
              onClick={() => {
                setState((currentState) => {
                  return { ...currentState, title: draftEdit };
                });
                setIsEditing(false);
              }}
            >
              Update
            </button>
          </div>
        ) : (
          <Fragment>
            <input
              type="checkbox"
              id={`todo-${id}`}
              name={`todo-${id}`}
              checked={state.done}
              onChange={() => {
                setState((currentState) => {
                  return { ...currentState, done: !currentState.done };
                });
              }}
            />
            <label
              htmlFor={`todo-${id}`}
              style={{ textDecoration: state.done ? 'line-through' : 'none' }}
            >
              {state.title}
            </label>
          </Fragment>
        )}
        <div className="todo-btns">
          <button
            type="button"
            onClick={() => {
              setIsAdding(true);
            }}
          >
            +
          </button>
          <button
            type="button"
            onClick={() => {
              setIsEditing(true);
            }}
          >
            ✏️
          </button>
          <button
            type="button"
            onClick={() => {
              handleDelete();
            }}
          >
            🗑️
          </button>
        </div>
      </div>
      {todos?.length > 0 ? (
        <div style={{ marginLeft: `${ancestorIds.length + 1}rem` }}>
          {todos.map((t) => (
            <Todo
              key={t.id}
              {...t}
              done={state.done}
              ancestorIds={[...ancestorIds, id]}
              handleDelete={deleteSubTodo(t.id)}
              undoParent={undoFromChild}
            />
          ))}
        </div>
      ) : null}
      {isAdding ? (
        <div style={{ marginLeft: `${ancestorIds.length + 1}rem` }}>
          <input
            type="text"
            onChange={(e) => {
              setDraftAdd(e.target.value);
            }}
          />
          <button
            type="button"
            onClick={() => {
              setTodos((t) => {
                return [
                  ...t,
                  { title: draftAdd, done: state.done, id: uuidv4() },
                ];
              });
              setIsAdding(false);
            }}
          >
            Add
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default App;
