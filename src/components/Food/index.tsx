import { FiEdit3, FiTrash } from "react-icons/fi";

import { Container } from "./styles";
import api from "../../services/api";

interface FoodObjectProps {
  id: number;
  name: string;
  description: string;
  price: string;
  available: boolean;
  image: string;
}

interface FoodProps {
  food: FoodObjectProps;
  handleDelete: (id: number) => void;
  handleEditFood: (food: FoodObjectProps) => void;
}

export default function Food(props: FoodProps) {
  const toggleAvailable = async () => {
    const { food } = props;
    const { available } = props.food;

    await api.put(`/foods/${food.id}`, {
      ...food,
      available: !available,
    });
  };

  const setEditingFood = () => {
    const { food, handleEditFood } = props;

    handleEditFood(food);
  };

  //const { isAvailable } = props.state;
  const { food, handleDelete } = props;

  return (
    <Container available={food.available}>
      <header>
        <img src={food.image} alt={food.name} />
      </header>
      <section className="body">
        <h2>{food.name}</h2>
        <p>{food.description}</p>
        <p className="price">
          R$ <b>{food.price}</b>
        </p>
      </section>
      <section className="footer">
        <div className="icon-container">
          <button
            type="button"
            className="icon"
            onClick={setEditingFood}
            data-testid={`edit-food-${food.id}`}
          >
            <FiEdit3 size={20} />
          </button>

          <button
            type="button"
            className="icon"
            onClick={() => handleDelete(food.id)}
            data-testid={`remove-food-${food.id}`}
          >
            <FiTrash size={20} />
          </button>
        </div>

        <div className="availability-container">
          <p>{food.available ? "Disponível" : "Indisponível"}</p>

          <label htmlFor={`available-switch-${food.id}`} className="switch">
            <input
              id={`available-switch-${food.id}`}
              type="checkbox"
              checked={food.available}
              onChange={toggleAvailable}
              data-testid={`change-status-food-${food.id}`}
            />
            <span className="slider" />
          </label>
        </div>
      </section>
    </Container>
  );
}