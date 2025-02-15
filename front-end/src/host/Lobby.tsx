import * as React from 'react';
import '../style.css';
import { Socket } from 'socket.io-client';
import IPlayer from 'back-end/interfaces/IPlayer';
import LobbyView from './LobbyView';

interface ILobbyProps {
  socket: Socket,
  gameId: number
}

export default function Lobby(props: ILobbyProps) {
  const [players, setPlayers] = React.useState<IPlayer[]>([]);
  const { socket, gameId } = props;

  React.useEffect(() => {
    function onPlayersUpdated(playersObject: any) {
      if (gameId !== -1 && playersObject.gameId === gameId) {
        setPlayers(playersObject.players);
      }
    }
  
    socket.on('players-updated', onPlayersUpdated);

    return () => {
      socket.off('players-updated', onPlayersUpdated);
    }
  }, [players, setPlayers]);

  return <LobbyView playerNames={players.map(p => p.name)} gameId={gameId} socket={socket} />;
}
