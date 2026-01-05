import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import personService from "./services/persons";
import Notification from "./components/Notification";
const FilterShow = (props) => {
  const searchTerm = props.searchTerm;
  const onChange = props.onChange;
  return (
    <div>
      filter shown <input value={searchTerm} onChange={onChange} />
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState(null);
  const [style, setStyle] = useState(null);

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(event);
    const personObject = {
      name: newName,
      number: newNumber,
    };

    if (
      persons.some(
        (person) => person.name.toLowerCase() === newName.toLowerCase()
      )
    ) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        const id = persons.find(
          (person) => person.name.toLowerCase() === newName.toLowerCase()
        ).id;
        personService
          .update(id, personObject)
          .then((returnedPerson) => {
            setPersons(
              persons.map((persons) =>
                persons.id === id ? returnedPerson : persons
              )
            );
            setMessage(`Changed ${newName}'s number`);
            setNewName("");
            setNewNumber("");
            setStyle("success");
            setTimeout(() => {
              setMessage(null);
              setStyle(null);
            }, 5000);
          })
          .catch((error) => {
            setMessage(`Information of ${newName} could not be found`);
            setStyle("error");
            setTimeout(() => {
              setMessage(null);
              setStyle(null);
            }, 5000);
          });
        return;
      }
    }

    personService
      .create(personObject)
      .then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setNewName("");
        setNewNumber("");
        setMessage(`Added ${newName}`);
        setStyle("success");
        setTimeout(() => {
          setMessage(null);
          setStyle(null);
        }, 5000);
      })
      .catch((error) => {
        setMessage(`Could not add ${newName}`);
        setStyle("error");
        setTimeout(() => {
          setMessage(null);
          setStyle(null);
        }, 5000);
      });
  };

  const handleRemove = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personService.remove(person.id).then((res) => {
        setPersons(persons.filter((persons) => persons.id !== person.id));
      });
    }
  };

  const namesToShow =
    searchTerm === ""
      ? persons
      : persons.filter((person) =>
          person.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

  return (
    <div>
      <Notification message={message} style={style} />
      <h2>Phonebook</h2>
      <div>
        <FilterShow
          searchTerm={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>
      <h2>add a new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          name: <input value={newName} onChange={handleNameChange} required />
        </div>
        <div>
          number:{" "}
          <input value={newNumber} onChange={handleNumberChange} required />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {namesToShow.map((person) => (
          <li key={person.name}>
            {person.name} {person.number}{" "}
            <button onClick={() => handleRemove(person)}>delete</button>{" "}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
