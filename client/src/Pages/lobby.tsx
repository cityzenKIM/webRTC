import '../App.css';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export default function Lobby() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState<string>("");
  const [disable, setDisable] = useState<boolean>(false);
  const [rooms, setRooms] = useState<object[]>([])
  
  const SOCKET_SERVER_URL = 'http://localhost:8080';
  const socket = io(SOCKET_SERVER_URL); 

  useEffect(() => {
    socket.emit('rooms');
    return () => {
      socket.disconnect();
    }
  }, [])

  useEffect(() => {
    socket.on('get_rooms', (rooms) => {
      setRooms(rooms)
      console.log(rooms)
    });
    return () => {
      socket.disconnect();
    }
  })

  function goRoom() {
    navigate('/room', {
      state: {
        id: "db8fad82-386a-4986-b974-03ef02459555",
        nickName: nickname
      }
    });
  }

  const onChangeNick = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  const hadleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setDisable(true);
  };

  return (
    
    <div className="home">
      {/* <div>
        {rooms.map((room) => {
          return ()
        })}
      </div> */}
      <h2
        style={{
          textAlign: "center",
        }}
      >닉네임을 입력하세요!</h2>
      <div
        id="nick__wrapper"
        style={{
          textAlign: "center",
        }}
      >
        <input
          onChange={onChangeNick}
          id="nick__input"
          type="text"
          style={{
            margin: "0px 10px",
          }}
        />
        <button onClick={hadleSubmit} disabled={disable}>결정</button>
        <p>당신의 닉네임은 {nickname} 입니다!</p>
      </div>
      <button onClick={goRoom}>방으로이동</button>
      </div>
  );
}