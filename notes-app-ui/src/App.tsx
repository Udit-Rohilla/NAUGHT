import "./App.css";
import { MdDeleteForever } from "react-icons/md";
import { useEffect, useState } from "react";

type Note = {
  id: number;
  title: string;
  content: string;
};

const App = () => {
  const [notes, setNotes] = useState<Note[]>([]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/notes");
        const data = await response.json();


        const notesArray: Note[] = Array.isArray(data) ? data : [data];
        setNotes(notesArray);
      } catch (e) {
        console.log(e);
      }
    };

    fetchNotes();
  }, []);


    const handleNoteClick = (note:Note) => {
        setSelectedNote(note);
        setTitle(note.title);
        setContent(note.content);
    }
    const handleAddNote = async(
        event: React.FormEvent
    ) => {
        event.preventDefault();
        
        try {
            const response = await fetch(
                "http://localhost:5000/api/notes",
                {
                    method:"POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        title,
                        content
                    })
                }
            );

            const newNote = await response.json();

            setNotes([newNote, ...notes]);
            setTitle("");
            setContent("");
        } catch (e) {
            console.log(e);
        }
    };

    const handleUpdateNote = async(
        event: React.FormEvent
    ) => {
        event.preventDefault();

        if(!selectedNote) {
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:5000/api/notes/${selectedNote.id}`,
                {
                    method:"PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        title,
                        content,
                    })
                }
            )

            const updatedNote = await response.json();
            const updatedNotesList = notes.map((note)=>
            note.id === selectedNote.id 
                ? updatedNote
                : note
        );

        setNotes(updatedNotesList)
        setTitle("")
        setContent("")
        setSelectedNote(null);

        } catch (e) {
            console.log(e);
        }
    };

    const handleCancel = () => {
        setTitle("")
        setContent("")
        setSelectedNote(null);
    };

    const deleteNote = async (
        event: React.MouseEvent,
        noteId: number
        ) => {
        event.stopPropagation();
    
        try {
          await fetch(
            `http://localhost:5000/api/notes/${noteId}`,
            {
              method: "DELETE",
            }
          );
          const updatedNotes = notes.filter(
            (note) => note.id !== noteId
          );
    
          setNotes(updatedNotes);
        } catch (e) {
          console.log(e);
        }
    };

    return (
        <div className="heading">
          <h1> NAUGHT - Note Taking App</h1>
          <div className="app-container">
            <form
              className="note-form"
              onSubmit={(event) =>
                selectedNote
                  ? handleUpdateNote(event)
                  : handleAddNote(event)
              }
            >
              <input
                className="input-form"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Title"
                required
              />
              <textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="Type to add a note..."
                rows={10}
                required
              ></textarea>
    
              {selectedNote ? (
                <div className="edit-buttons"> 
                    <button type="submit">Save</button>
                    <button onClick={handleCancel}>Cancel</button>
                </div>
              ) : (
                <button type="submit">Add Note</button>
              )}
            </form>
            <div className="notes-grid">
              {Array.isArray(notes) && notes.map((note) => (
                <div className="note-item" onClick={() => handleNoteClick(note)}>
                  <div className="notes-header">
                    <button className = "delete-button"
                      onClick={(event) => 
                          deleteNote(event, note.id)
                          }
                    >
                      <MdDeleteForever
                        size = '1.4em'/>
                    </button>
                  </div>
                  <h2>{note.title}</h2>
                  <p>{note.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    };
    
    export default App;