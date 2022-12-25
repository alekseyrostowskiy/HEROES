import { useHttp } from "../../hooks/http.hook";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";

import { fetchHeroes, heroDeleted } from "../../actions";
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from "../spinner/Spinner";

// Задача для этого компонента:
// При клике на "крестик" идет удаление персонажа из общего состояния
// Усложненная задача:
// Удаление идет и с json файла при помощи метода DELETE

const HeroesList = () => {
  const filteredHeroesSelector = createSelector(
    (state) =>
      state.filters
        .activeFilter /* первое значение, которое хотим использовать */,
    (state) =>
      state.heroes.heroes /* второе значение, которое хотим использовать */,
    (filter, heroes) => {
      /* то, что мы хотим сделать с этими значениями */
      if (filter === "all") {
        return heroes;
      } else {
        return heroes.filter((item) => item.element === filter);
      }
    }
  );
  const filteredHeroes = useSelector(filteredHeroesSelector);
  const heroesLoadingStatus = useSelector(
    (state) => state.heroes.heroesLoadingStatus
  );
  const dispatch = useDispatch();
  const { request } = useHttp();

  useEffect(() => {
    dispatch(fetchHeroes(request));

    // eslint-disable-next-line
  }, []);

  const onDelete = useCallback(
    (id) => {
      // Удаление персонажа по его id
      request(`http://localhost:3001/heroes/${id}`, "DELETE")
        .then((data) => console.log(data, "Deleted"))
        .then(dispatch(heroDeleted(id)))
        .catch((err) => console.log(err));
      // eslint-disable-next-line
    },
    [request]
  );

  if (heroesLoadingStatus === "loading") {
    return <Spinner />;
  } else if (heroesLoadingStatus === "error") {
    return <h5 className="text-center mt-5">Ошибка загрузки</h5>;
  }

  const renderHeroesList = (filteredArr) => {
    if (filteredArr.length === 0) {
      return <h5 className="text-center mt-5">Героев пока нет</h5>;
    }

    return filteredArr.map(({ id, ...props }) => (
      <HeroesListItem
        key={id}
        {...props}
        onDelete={() => {
          onDelete(id);
        }}
      />
    ));
  };

  const elements = renderHeroesList(filteredHeroes);
  return <ul>{elements}</ul>;
};

export default HeroesList;
