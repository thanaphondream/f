import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function GamePointsAdmin({reload, setReload}) {
  const [games, setGames] = useState([]);
  const [modalGame, setModalGame] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get("http://localhost:8889/admin/getGamePoints");
        setGames(response.data.get);
      } catch (error) {
        console.error("Error fetching game points:", error);
      }
    };

    fetchGames();
  }, [reload]);

  const handleEditClick = (game) => {
    setModalGame(game);
    setEditData(
      game.Point.reduce((acc, point) => ({ ...acc, [point.id]: { point: point.point, price: point.price } }), {})
    );
  };

  const handleSaveClick = async () => {
    if (!modalGame) return;

    try {
      await Promise.all(
        Object.keys(editData).map((pointId) =>
          axios.patch(`http://localhost:8889/admin/updateGamePoint/${pointId}`, editData[pointId])
        )
      );
      toast.success("แก้ไขเรียบร้อย")
      setReload(!reload)
      setModalGame(null); // Close the modal
      setEditData({});
    } catch (error) {
      console.error("Error updating game data", error);
    }
  };

  const handleDelete = async (pointId) => {
    if (!modalGame) return;

    const confirmDelete = window.confirm("Are you sure you want to delete this point?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:8889/admin/deleteGamePoint/${pointId}`);
      setEditData((prevData) => {
        const { [pointId]: _, ...remaining } = prevData;
        return remaining;
      });
      toast.success("ลบแต้มเกมส์เรียบร้อยแล้ว")
    } catch (error) {
      console.error("Error deleting point", error);
    }
  };

  const handleChange = (pointId, e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({
      ...prevData,
      [pointId]: {
        ...prevData[pointId],
        [name]: value,
      },
    }));
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">จัดการพอยท์และราคาเกม</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {games.map((game) => (
          <div key={game.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
            <img src={game.img} alt={game.game_name} className="w-full h-48 object-cover pointer-events-none" />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{game.game_name}</h2>
              <div className="mb-4">
                {game.Point.map((point) => (
                  <div key={point.id} className="mb-2 p-3 border rounded bg-gray-50">
                    <p className="text-lg font-medium">Points: {point.point}</p>
                    <p className="text-lg">Price: {point.price} THB</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => handleEditClick(game)}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                แก้ไข
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalGame && (
        <dialog id={`edit_modal_${modalGame.id}`} open className="modal">
          <div className="modal-box bg-white rounded-lg p-6 shadow-lg max-w-lg mx-auto">
            <h3 className="text-2xl font-semibold mb-4">แก้ไขแต้มและราคา {modalGame.game_name}</h3>
            {modalGame.Point.map((point) => (
              <div key={point.id} className="mb-6 p-4 border rounded bg-gray-50">
                <h4 className="text-lg font-medium mb-2">Point ID: {point.id}</h4>
                <label className="block mb-4">
                  <span className="block text-sm font-medium mb-1">Points</span>
                  <input
                    type="number"
                    name="point"
                    value={editData[point.id]?.point || ''}
                    onChange={(e) => handleChange(point.id, e)}
                    className="input input-bordered w-full"
                  />
                </label>
                <label className="block mb-4">
                  <span className="block text-sm font-medium mb-1">Price</span>
                  <input
                    type="number"
                    name="price"
                    value={editData[point.id]?.price || ''}
                    onChange={(e) => handleChange(point.id, e)}
                    className="input input-bordered w-full"
                  />
                </label>
                <button
                  onClick={() => handleDelete(point.id)}
                  className="btn btn-danger mt-2"
                >
                  ลบพ้อย
                </button>
              </div>
            ))}
            <div className="flex justify-end">
              <button
                className="btn btn-success"
                onClick={handleSaveClick}
              >
                บันทึก
              </button>
            </div>
            <button
              className="btn btn-secondary mt-4"
              onClick={() => setModalGame(null)} // Close the modal
            >
              ปิด
            </button>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setModalGame(null)}>ปิด</button>
          </form>
        </dialog>
      )}
    </div>
  );
}
