import { useEffect, useState } from "react";

import Header from "../../components/Header";
import api from "../../services/api";
import Food from "../../components/Food";
import ModalAddFood from "../../components/ModalAddFood";
import ModalEditFood from "../../components/ModalEditFood";
import { FoodsContainer } from "./styles";
import Modal from "react-modal";

interface FoodProps {
  id: number;
  name: string;
  description: string;
  price: string;
  available: boolean;
  image: string;
}

interface DashboardProps {
  foods: FoodProps[];
  editingFood: FoodProps;
  modalOpen: boolean;
  editModalOpen: boolean;
}

Modal.setAppElement("#root");

export default function Dashboard(props: DashboardProps) {
  const [foodsToList, setFoodsToList] = useState<FoodProps[]>(props.foods);
  const [modalToOpen, setModalToOpen] = useState(false);
  const [modalEditToOpen, setModalEditToOpen] = useState(false);
  const [toEditingFood, setToEditingFood] = useState<FoodProps>(
    {} as FoodProps
  );

  useEffect(() => {
    async function loadFood() {
      const response = await api.get<FoodProps[]>("/foods");

      const data = response.data.map((food) => food);

      setFoodsToList(data);
    }

    loadFood();
  }, []);

  const handleAddFood = async (food: FoodProps) => {
    try {
      const response = await api.post<FoodProps>("/foods", {
        ...food,
        available: true,
      });

      setFoodsToList([...foodsToList, response.data]);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdateFood = async (food: FoodProps) => {
    const { foods } = props;

    try {
      const foodUpdated = await api.put(`/foods/${toEditingFood.id}`, {
        ...toEditingFood,
        ...food,
      });

      const foodsUpdated = foods.map((f) =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data
      );

      setFoodsToList(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteFood = async (id: number) => {
    await api.delete(`/foods/${id}`);

    const response = await api.get<FoodProps[]>("/foods");

    const data = response.data.map((food) => food);

    setFoodsToList(data);
  };

  const toggleModal = () => {
    setModalToOpen(!modalToOpen);
  };

  const toggleEditModal = () => {
    setModalEditToOpen(!modalEditToOpen);
  };

  const handleEditFood = (food: FoodProps) => {
    setToEditingFood(food);
    setModalEditToOpen(true);
  };

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalToOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={modalEditToOpen}
        setIsOpen={toggleEditModal}
        editingFood={toEditingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foodsToList &&
          foodsToList.map((food) => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}
