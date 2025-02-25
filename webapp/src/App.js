import React, { useState, useEffect } from "react";
import axios from "axios";
import Web3 from "web3";

const App = () => {
  const [message, setMessage] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false); // เพิ่ม state สำหรับ Loading

  useEffect(() => {
    fetchMessage();
  }, []);

  // ✅ ฟังก์ชันดึงข้อความจาก Smart Contract
  const fetchMessage = async () => {
    try {
      const response = await axios.get("http://localhost:5000/message");
      setMessage(response.data.message);
    } catch (error) {
      console.error("❌ Error fetching message:", error);
    }
  };

  // ✅ ฟังก์ชันอัปเดตข้อความไปยัง Smart Contract
  const updateMessage = async () => {
    if (!newMessage || newMessage.trim() === "") {
        alert("กรุณากรอกข้อความก่อนอัปเดต!");
        return;
    }

    try {
        setLoading(true); // เริ่ม Loading
        const response = await axios.post("http://localhost:5000/message", {
            message: newMessage, // ✅ เปลี่ยนจาก `newMessage` เป็น `message`
        });

        console.log("✅ Transaction Hash:", response.data.transactionHash);
        alert("ข้อความอัปเดตสำเร็จ! 🎉");

        setNewMessage(""); // เคลียร์ช่อง input
        fetchMessage(); // โหลดข้อความใหม่จาก Smart Contract
    } catch (error) {
        console.error("❌ Error updating message:", error);
        alert("เกิดข้อผิดพลาดในการอัปเดตข้อความ");
    } finally {
        setLoading(false); // ปิด Loading
    }
};


  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Smart Contract Message</h1>
      <p>Message: <strong>{message}</strong></p>

      <input
        type="text"
        placeholder=" "
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        disabled={loading} // ปิด input ขณะโหลด
      />
      
      <button onClick={updateMessage} disabled={loading}>
        {loading ? "กำลังอัปเดต..." : "Update Message"}
      </button>
    </div>
  );
};

export default App;
