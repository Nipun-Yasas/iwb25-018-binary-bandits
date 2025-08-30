"use client";

import React, { useState } from 'react';
import ChatbotIcon from './ChatbotIcon';
import ChatbotModal from './ChatbotModal';

const Chatbot: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <ChatbotIcon onClick={handleOpenModal} />
      <ChatbotModal open={isModalOpen} onClose={handleCloseModal} />
    </>
  );
};

export default Chatbot;
