import React from 'react';
import styled from 'styled-components';
import './GlobalStyle';
import { nanoid } from 'nanoid';
import { Box } from './Box';
import { Section } from 'components/Section/Section';
import ContactForm from './ContactForm/ContactForm';
import ContactList from 'components/ContactList/ContactList';
import Filter from 'components/Filter/Filter';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addContact,
  getContacts,
  filterChange,
  removeContact,
  getFilterValue,
} from 'redux/contactSlise';

const Title = styled.h1`
  text-align: center;
  font-size: ${p => p.theme.fontSizes.l};
  font-weight: ${p => p.theme.fontWeights.bold};
  margin-top: ${p => p.theme.space[0]}px;
  margin-bottom: ${p => p.theme.space[0]}px;
`;

export default function App() {
  const items = useSelector(getContacts);
  const dispatch = useDispatch();
  const filterValueReducer = useSelector(getFilterValue);
  const [contacts, setContacts] = useState(items);
  const [filter, setFilter] = useState(filterValueReducer);

  const getVisibleContacts = () => {
    const normalizeFilter = filter.toLowerCase();
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(normalizeFilter)
    );
  };

  const deleteContact = contactId => {
    dispatch(removeContact(contactId));
    setContacts(contacts.filter(contact => contact.id !== contactId));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const name = e.target.name.value;
    const number = e.target.number.value;
    const addedContact = { id: nanoid(), name, number };

    const auditContact = contacts.some(
      contact => contact.name.toLowerCase() === name.toLowerCase()
    );

    auditContact
      ? alert(`Sorry, ${name} is already in your contacts`)
      : setContacts(() => [addedContact, ...contacts]);

    dispatch(addContact(addedContact));
    e.target.reset();
  };

  const changeFilter = e => {
    dispatch(filterChange(e.currentTarget.value));
    setFilter(e.currentTarget.value);
  };

  return (
    <Box
      bg="firstBgColor"
      color="mainTextColor"
      p={4}
      pl={5}
      pr={5}
      width="360px"
      fontFamily="Ubuntu"
      fontSize={16}
      border="2px solid"
      borderRadius={16}
    >
      <Title>Phonebook</Title>
      <Section>
        <ContactForm onSubmit={handleSubmit} />
      </Section>

      <Section title="Contacts">
        <Filter value={filter} onChange={changeFilter} />
        <ContactList
          contacts={getVisibleContacts()}
          onDeletContact={deleteContact}
        />
      </Section>
    </Box>
  );
}
