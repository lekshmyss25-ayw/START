
import { useState, useEffect } from "react";
import "./App.css";


const getInitialNotes = () => {
    const savedNotes = localStorage.getItem("my-notes-app-data");
    return savedNotes ? JSON.parse(savedNotes) : [];
};

export default function App() {
    
    const [title, setTitle] = useState("");
    const [des, setDes] = useState("");
    const [notes, setNotes] = useState(getInitialNotes);
    const [count, setCount] = useState(() => {
        const savedNotes = getInitialNotes();
        return savedNotes.length > 0 ? Math.max(...savedNotes.map(n => n.key)) + 1 : 1;
    });

   
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDes, setEditDes] = useState("");

    
    useEffect(() => {
        localStorage.setItem("my-notes-app-data", JSON.stringify(notes));
    }, [notes]);

    function remove(id) {
        setNotes(notes.filter((e) => e.key !== id));
        if (editingId === id) cancelEdit(); 
    }

    function handle() {
        if (!title.trim() || !des.trim()) {
            window.alert("Incomplete input");
            return;
        }
        setNotes((prevNotes) => [...prevNotes, { key: count, title, des }]);
        setCount((prevCount) => prevCount + 1);
        setTitle("");
        setDes("");
    }

    function startEdit(note) {
        setEditingId(note.key);
        setEditTitle(note.title);
        setEditDes(note.des);
    }

    function cancelEdit() {
        setEditingId(null);
        setEditTitle("");
        setEditDes("");
    }

    function saveEdit(id) {
        if (!editTitle.trim() || !editDes.trim()) {
            window.alert("Fields cannot be empty");
            return;
        }
        setNotes(notes.map((note) => 
            note.key === id ? { ...note, title: editTitle, des: editDes } : note
        ));
        cancelEdit();
    }

    return (
        <div className="App" style={{ fontFamily: "sans-serif", padding: "20px", minHeight: "100vh" }}>
            
            
            <div className="card" style={{ maxWidth: "500px", margin: "0 auto 40px auto", background: "#fff", padding: "15px", borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
                <div className="add" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{ border: "none", outline: "none", fontSize: "16px", fontWeight: "bold" }}
                    />
                    <textarea
                        placeholder="Take a note..."
                        value={des}
                        onChange={(e) => setDes(e.target.value)}
                        rows={3}
                        style={{ border: "none", outline: "none", resize: "none", fontSize: "14px" }}
                    />
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <button onClick={handle} style={{ background: "#fbbc04", border: "none", padding: "8px 16px", borderRadius: "4px", fontWeight: "bold", cursor: "pointer" }}>
                            Add Note
                        </button>
                    </div>
                </div>
            </div>

           
            <div className="notes-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "16px", maxWidth: "1200px", margin: "0 auto" }}>
                {notes.map((note) => (
                    <div key={note.key} className="note-card" style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: "8px", padding: "15px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "120px", transition: "box-shadow 0.2s" }}>
                        {editingId === note.key ? (
                           
                            <div className="edit-mode" style={{ display: "flex", flexDirection: "column", gap: "10px", height: "100%" }}>
                                <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    style={{ width: "100%", boxSizing: "border-box", padding: "4px" }}
                                />
                                <textarea
                                    value={editDes}
                                    onChange={(e) => setEditDes(e.target.value)}
                                    style={{ width: "100%", boxSizing: "border-box", resize: "none", flexGrow: 1, padding: "4px" }}
                                />
                                <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                                    <button onClick={() => saveEdit(note.key)} style={{ padding: "4px 8px", cursor: "pointer"  }} className="add-button">Save</button>
                                    <button onClick={cancelEdit} style={{ padding: "4px 8px", cursor: "pointer" }} className="delete-button">Cancel</button>
                                </div>
                            </div>
                        ) : (
                            
                            <div className="view-mode" style={{ display: "flex", flexDirection: "column", height: "100%" , backgroundColor: "#efe580", padding: "10px", borderRadius: "6px"}}>
                                <h3 style={{ margin: "0 0 10px 0", fontSize: "16px", wordBreak: "break-word" }}>{note.title}</h3>
                                <p style={{ margin: "0 0 20px 0", fontSize: "14px", color: "#5f6368", flexGrow: 1, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{note.des}</p>
                                <div className="note-actions" style={{ display: "flex", gap: "10px", justifyContent: "flex-end", borderTop: "1px solid #f1f1f1", paddingTop: "8px" }}>
                                    <button onClick={() => startEdit(note)} style={{ background: "transparent", border: "none", color: "#1a73e8", cursor: "pointer", fontSize: "12px" }}>Edit</button>
                                    <button onClick={() => remove(note.key)} style={{ background: "transparent", border: "none", color: "#d93025", cursor: "pointer", fontSize: "12px" }}>Delete</button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
