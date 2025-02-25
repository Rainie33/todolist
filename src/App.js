import { useEffect, useState } from 'react';

export default function App() {
  // 提升 state 到最上層
  const [items, setItems] = useState([]);

  // 讀取 localStorage 中的資料並設定初始值
  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem('items')) || [];
    setItems(storedItems);
  }, []);

  // 更新 localStorage 中的資料
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem('items', JSON.stringify(items));
    }
  }, [items]);

  // 處理新增項目
  function handleAddItem(item) {
    setItems((items) => [...items, item]);
  }

  // 處理刪除項目
  function handleDeleteItem(id) {
    setItems((items) => items.filter((item) => item.id !== id));
  }

  // 處理切換項目狀態
  function handleToggleItem(id) {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, state: !item.state } : item
      )
    );
  }

  // 處理編輯項目
  function handleEditItem(id, newDescription) {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, description: newDescription } : item
      )
    );
  }

  return (
    <div className="app">
      <Logo />
      <Enter onAddItems={handleAddItem} />
      <List
        items={items}
        onDeleteItem={handleDeleteItem}
        onToggleItem={handleToggleItem}
        onEditItem={handleEditItem}
      />
    </div>
  );
}

function Logo() {
  return <h1>Todolist</h1>;
}

function Enter({ onAddItems }) {
  // 1. Hook 設定 input 初始狀態
  const [description, setDescription] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    // console.log(e.target[0].value);

    // 若未輸入內容則不執行
    if (!description) return;

    // 4. 建立物件將 input 的值放進 newItem
    const newItem = { description, state: false, id: Date.now() };
    console.log(newItem);

    onAddItems(newItem);

    // 5. 恢復 input 初始狀態
    setDescription('');
  }

  return (
    <form className="add-enter" onSubmit={handleSubmit}>
      <input
        className="enter"
        type="text"
        placeholder="  Add a new tasks...📝"
        // 2. 雙向綁定
        value={description}
        // 3. Hook 抓取 input 的值顯示於畫面
        onChange={(e) => setDescription(e.target.value)}
      />
      <button className="add-button">+</button>
    </form>
  );
}

function List({ items, onDeleteItem, onToggleItem, onEditItem }) {
  return (
    <div className="list">
      <ul>
        {items.map((item) => (
          <Item
            item={item}
            onDeleteItem={onDeleteItem}
            onToggleItem={onToggleItem}
            onEditItem={onEditItem}
            key={item.id}
          />
        ))}
      </ul>
    </div>
  );
}

function Item({ item, onDeleteItem, onToggleItem, onEditItem }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newDescription, setNewDescription] = useState(item.description);

  // 切換編輯模式
  function toggleEditMode() {
    setIsEditing(!isEditing);
  }

  // 處理修改後的文字
  function handleEditChange(e) {
    setNewDescription(e.target.value);
  }

  // 提交修改
  function handleEditSubmit(e) {
    e.preventDefault();
    if (newDescription.trim()) {
      onEditItem(item.id, newDescription);
      // 關閉編輯模式
      toggleEditMode();
    }
  }

  return (
    <li>
      <input
        className="check-box"
        // 讓 checkbox 的值和 item.state 綁定
        value={item.state}
        type="checkbox"
        onChange={() => onToggleItem(item.id)}
      />

      {/* 顯示待辦內容或編輯狀態 */}
      {isEditing ? (
        <form onSubmit={handleEditSubmit}>
          <input
            className="Update"
            type="text"
            value={newDescription}
            onChange={handleEditChange}
            autoFocus
          />
        </form>
      ) : (
        <span
          className="text"
          // 判斷 若完成就劃掉
          style={item.state ? { textDecoration: 'line-through' } : {}}
        >
          {item.description}
        </span>
      )}
      <span className="edit-icon" onClick={toggleEditMode}>
        ✏️
      </span>
      <span className="delete-icon" onClick={() => onDeleteItem(item.id)}>
        🗑️
      </span>
    </li>
  );
}
