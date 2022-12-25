import { useDispatch } from "react-redux";
import { useState } from "react";
import { heroCreated } from "../../actions";
import { v4 as uuidv4 } from "uuid";
import { useHttp } from "../../hooks/http.hook";

// Задача для этого компонента:
// Реализовать создание нового героя с введенными данными. Он должен попадать
// в общее состояние и отображаться в списке + фильтроваться
// Уникальный идентификатор персонажа можно сгенерировать через uiid
// Усложненная задача:
// Персонаж создается и в файле json при помощи метода POST
// Дополнительно:
// Элементы <option></option> желательно сформировать на базе
// данных из фильтров

const HeroesAddForm = () => {
  const dispatch = useDispatch();
  const [heroDescr, setHeroDescr] = useState("");
  const [heroName, setHeroName] = useState("");
  const [heroElement, setHeroElement] = useState("");

  const { request } = useHttp();

  const addHero = (e) => {
    e.preventDefault();
    // Можно сделать и одинаковые названия состояний,
    // хотел показать вам чуть нагляднее
    // Генерация id через библиотеку
    const newHero = {
      id: uuidv4(),
      name: heroName,
      description: heroDescr,
      element: heroElement,
    };

    // Отправляем данные на сервер в формате JSON
    // ТОЛЬКО если запрос успешен - отправляем персонажа в store
    request("http://localhost:3001/heroes", "POST", JSON.stringify(newHero))
      .then((res) => console.log(res, "Отправка успешна"))
      .then(dispatch(heroCreated(newHero)))
      .catch((err) => console.log(err));

    // Очищаем форму после отправки
  };

  return (
    <form className="border p-4 shadow-lg rounded" onSubmit={addHero}>
      <div className="mb-3">
        <label htmlFor="name" className="form-label fs-4">
          Имя нового героя
        </label>
        <input
          value={heroName}
          required
          type="text"
          name="name"
          className="form-control"
          id="name"
          placeholder="Как меня зовут?"
          onChange={(e) => {
            setHeroName(e.target.value);
          }}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="text" className="form-label fs-4">
          Описание
        </label>
        <textarea
          required
          value={heroDescr}
          name="text"
          className="form-control"
          id="text"
          placeholder="Что я умею?"
          style={{ height: "130px" }}
          onChange={(e) => {
            setHeroDescr(e.target.value);
          }}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="element" className="form-label">
          Выбрать элемент героя
        </label>
        <select
          required
          value={heroElement}
          className="form-select"
          id="element"
          name="element"
          onChange={(e) => {
            setHeroElement(e.target.value);
          }}
        >
          <option>Я владею элементом...</option>
          <option value="fire">Огонь</option>
          <option value="water">Вода</option>
          <option value="wind">Ветер</option>
          <option value="earth">Земля</option>
        </select>
      </div>

      <button type="submit" className="btn btn-primary">
        Создать
      </button>
    </form>
  );
};

export default HeroesAddForm;
