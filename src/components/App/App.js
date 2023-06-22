import React, { useEffect, useState } from "react";
import "./App.css";
import { Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Todo from "../To-Do/todo";
import FormTodo from "../FormTodo/formtodo";
import { SketchPicker } from 'react-color';

const getLocalItems = () => {
  let list = localStorage.getItem("lists");

  return list && list !== "undefined" && list !== "null"
    ? JSON.parse(list)
    : [];
};

function App() {
  const [todos, setTodos] = useState(getLocalItems);
  const [newToDos, setNewToDos] = useState("");
  const [colors, setColors] = useState([]);
  const [selectedTodoIndexes, setSelectedTodoIndexes] = useState([]);
  const [selectedColor, setSelectedColor] = useState("#ffffff");

  const ToDos = () => {
    if (newToDos) {
      setTodos([
        ...todos,
        {
          text: newToDos,
          isDone: false,
          color: selectedColor // Save selected color for new todo
        },
      ]);
      setColors([
        ...colors,
        selectedColor
      ]);
      setNewToDos("");
    }
  };

  const addTodo = (text) => {
    const newTodos = [...todos, { text, color: selectedColor }];
    const newColors = [...colors, selectedColor];
    setTodos(newTodos);
    setColors(newColors);
  };
  
  const markTodo = (index) => {
    const newTodos = [...todos];
    newTodos[index].isDone = true;
    newTodos[index].color = colors[index];
    setTodos(newTodos);
  };
  
  const removeTodo = (index) => {
    const newTodos = [...todos];
    newTodos.splice(index, 1);
    const newColors = [...colors];
    newColors.splice(index, 1);
    setTodos(newTodos);
    setColors(newColors);
  };

  const handleColorChange = (color) => {
    const updatedTodos = todos.map((todo, index) => {
      if (selectedTodoIndexes.includes(index)) {
        return {
          ...todo,
          color: color.hex
        };
      }
      return todo;
    });
  
    setTodos(updatedTodos);
    setColors(updatedTodos.map((todo) => todo.color));
    setSelectedColor(color.hex); // Update selected color state
  };
  

  const handleTodoClick = (index) => {
    if (selectedTodoIndexes.includes(index)) {
      setSelectedTodoIndexes(selectedTodoIndexes.filter((i) => i !== index));
    } else {
      setSelectedTodoIndexes([...selectedTodoIndexes, index]);
    }
  };
  

  useEffect(() => {
    localStorage.setItem("lists", JSON.stringify(todos));
  }, [todos]);

  // useEffect(() => {
  //   const storedColor = localStorage.getItem("selectedColor");
  //   if (storedColor) {
  //     setSelectedColor(storedColor);
  //   }
  // }, []);

  // useEffect(() => {
  //   localStorage.setItem("selectedColor", selectedColor);
  // }, [selectedColor]);

  return (
    <div className="app">
      <div className="container">
        <h1 className="text-center mb-4">Список завдань</h1>
        <FormTodo addTodo={addTodo} ToDos={ToDos} />
        <div>
          {todos.map((todo, index) => (
            <Card key={index}>
              <Card.Body
                style={{
                  color: selectedTodoIndexes.includes(index) ? colors[index] : null
                }}
                onClick={() => handleTodoClick(index)}
              >
                <Todo
                  index={index}
                  todo={todo}
                  markTodo={markTodo}
                  removeTodo={removeTodo}
                />
              </Card.Body>
            </Card>
          ))}
        </div>
        <div className="color-picker">
          <h2>Виберіть колір:</h2>
          <SketchPicker color={selectedColor} onChange={handleColorChange} />
        </div>
      </div>
    </div>
  );
}

export default App;
