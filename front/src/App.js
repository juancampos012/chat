import './App.css';
import { io } from 'socket.io-client';
import { useState, useEffect } from 'react';
import { Layout, Input, Button, List, Typography, Modal } from 'antd';
import 'antd/dist/reset.css';

const { Header, Content, Footer } = Layout;
const { Text } = Typography;
const socket = io(`http://${window.location.hostname}:3010`);

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [mensajes, setMensajes] = useState([]);
  const [nombre, setNombre] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(true);

  useEffect(() => {
    socket.on('connect', () => setIsConnected(true));
    socket.on('chat_message', (data) => {
      setMensajes(mensajes => [...mensajes, data]);
    });

    return () => {
      socket.off('connect');
      socket.off('chat_message');
    };
  }, []);

  const enviarMensaje = () => {
    if (nuevoMensaje.trim()) {
      socket.emit('chat_message', {
        usuario: nombre,
        mensaje: nuevoMensaje
      });
      setNuevoMensaje('');
    }
  };

  const handleOk = () => {
    if (nombre.trim()) {
      setIsModalVisible(false);
    }
  };

  return (
    <Layout className="App" style={{ minHeight: '100vh' }}>
      <Modal
        title="Ingresa tu nombre"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="submit" type="primary" onClick={handleOk}>
            OK
          </Button>,
        ]}
      >
        <Input
          placeholder="Escribe tu nombre"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
        />
      </Modal>
      <Header style={{ backgroundColor: '#001529', color: 'white' }}>
        <h2 style={{ color: 'white' }}>{isConnected ? 'CONECTADO' : 'NO CONECTADO'}</h2>
      </Header>
      <Content style={{ padding: '50px 50px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '600px' }}>
          <List
            bordered
            dataSource={mensajes}
            renderItem={mensaje => (
              <List.Item>
                <Text strong>{mensaje.usuario}</Text>: {mensaje.mensaje}
              </List.Item>
            )}
            style={{ marginBottom: '20px' }}
          />
          <Input.Group compact>
            <Input
              style={{ width: 'calc(100% - 100px)' }}
              value={nuevoMensaje}
              onChange={e => setNuevoMensaje(e.target.value)}
              placeholder="Escribe un mensaje..."
              disabled={isModalVisible}
            />
            <Button type="primary" onClick={enviarMensaje} disabled={isModalVisible}>
              Enviar
            </Button>
          </Input.Group>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Chat App ©2023</Footer>
    </Layout>
  );
}

export default App;
