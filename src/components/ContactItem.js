import { useEffect, useState, useMemo } from "react";
import useAxiosPrivateIntercept from "./hooks/useAxiosPrivate";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { SiVerizon } from "react-icons/si";
import { FcCancel } from "react-icons/fc";

import "./ContactItem.css";

const ContactItem = ({
  conctactItemData,
  setContactItemData,
  setContactsData,
  contactsData,
}) => {
  // do zrobienia
  // sprawdzić czy się nie dublują maile
  // porównanie czy jakies dane w kontacie się zmieniły, żeby był sens zapisywac do bazy danych
  // okienko na wyświetlanie bęłdów jęsli kontakt się nie zapisze
  const axiosPrivateIntercept = useAxiosPrivateIntercept();

  const [contact, setContact] = useState(conctactItemData);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isValidPhone, setIsValidPhone] = useState(false);

  const MAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PHONE_REGEX = /^\d{9}$/;

  const handleAddMail = () => {
    const updatedContact = { ...contact };
    const updatedEmails = [...updatedContact.emails];
    const newEmail = {
      email: "",
      verify: false,
    };
    updatedEmails.push(newEmail);
    updatedContact.emails = updatedEmails;
    setContact(updatedContact);
  };

  const handleAddPhone = () => {
    const updatedContact = { ...contact };
    const updatedPhones = [...updatedContact.phones];
    const newPhone = {
      phone: "",
      verify: false,
    };
    updatedPhones.push(newPhone);
    updatedContact.phones = updatedPhones;
    setContact(updatedContact);
  };

  const handleChangeMailingTime = (info) => {
    setContact((prev) => {
      return {
        ...prev,
        mailing: {
          ...prev.mailing,
          time:
            info === "up"
              ? prev.mailing.time > 30
                ? 30
                : prev.mailing.time++
              : prev.mailing.time < 0
              ? 0
              : prev.mailing.time--,
        },
      };
    });
  };

  const checkMail = () => {
    const mails = contact.emails.map((mail) => mail.email);
    const verifyMails = mails.map((mail) => MAIL_REGEX.test(mail));
    setIsValidEmail(verifyMails);
  };

  const checkPhone = () => {
    const phones = contact.phones.map((phone) => phone.phone);
    const verifyPhones = phones.map((phone) => PHONE_REGEX.test(phone));
    setIsValidPhone(verifyPhones);
  };

  const handleUpdateContact = async () => {
    const _id = contactsData[0]._id;
    try {
      const result = await axiosPrivateIntercept.patch(
        `/contacts/update-contact/${_id}`,
        {
          contactItem: contactsData[0],
        }
      );
      const filteredContacts = contactsData.map((item) => {
        if (item._id === contact._id) {
          return contact;
        }
        return item;
      });
      setContactsData(filteredContacts);
      setContactItemData({});
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    checkMail();
    checkPhone();
  }, [contact]);

  return (
    <section className="contact_item">
      <section className="contact_item__container">
        <section className="contact_item__title"></section>
        <section className="contact_item__context">
          <p className="contact_item--text">{contact.name}</p>
        </section>
        <section className="contact_item__settings"></section>
      </section>

      <section className="contact_item__container">
        <section className="contact_item__title">
          <span className="contact_item--name">NIP:</span>
        </section>
        <section className="contact_item__context">
          <p className="contact_item--text">{contact.NIP}</p>
        </section>
        <section className="contact_item__settings"></section>
      </section>

      <section className="contact_item__container">
        <section className="contact_item__title">
          <button
            className="contact_item--title--add"
            onClick={handleAddMail}
            disabled={isValidEmail ? isValidEmail.includes(false) : null}
          >
            Email:
          </button>
        </section>

        <section className="contact_item__context">
          {contact.emails.map((email, index) => (
            <section key={index} className="contact_item__item--context">
              <input
                className="contact_item__item--mail"
                type="text"
                value={email.email}
                onChange={(e) => {
                  const updatedEmails = [...contact.emails];
                  updatedEmails[index].email = e.target.value;

                  setContact((prev) => ({
                    ...prev,
                    emails: updatedEmails,
                  }));
                }}
              />
              {isValidEmail[index] ? (
                <SiVerizon className="contact_item__item--verify-mail" />
              ) : (
                <FcCancel className="contact_item__item--verify-mail" />
              )}
            </section>
          ))}
        </section>
        <section className="contact_item__settings">
          {contact.emails.map((email, index) => (
            <section key={index} className="contact_item__item--context">
              <input
                className="contact_item-checkbox"
                type="checkbox"
                checked={email.verify}
                onChange={(e) => {
                  const updatedEmails = [...contact.emails];
                  updatedEmails[index].verify = e.target.checked;

                  setContact((prev) => ({
                    ...prev,
                    emails: updatedEmails,
                  }));
                }}
              />
            </section>
          ))}
        </section>
      </section>

      <section className="contact_item__container">
        <section className="contact_item__title">
          <button
            className="contact_item--title--add"
            onClick={handleAddPhone}
            disabled={isValidPhone ? isValidPhone.includes(false) : null}
          >
            Telefon:
          </button>
        </section>

        <section className="contact_item__context">
          {contact.phones.map((phone, index) => (
            <section key={index} className="contact_item__item--context">
              <input
                className="contact_item__item--phone"
                type="text"
                value={phone.phone}
                onChange={(e) => {
                  const updatedPhones = [...contact.phones];
                  updatedPhones[index].phone = e.target.value;

                  setContact((prev) => ({
                    ...prev,
                    phones: updatedPhones,
                  }));
                }}
              />
              {isValidPhone[index] ? (
                <SiVerizon className="contact_item__item--verify-mail" />
              ) : (
                <FcCancel className="contact_item__item--verify-mail" />
              )}
            </section>
          ))}
        </section>
        <section className="contact_item__settings">
          {contact.phones.map((phone, index) => (
            <section key={index} className="contact_item__item--context">
              <input
                className="contact_item-checkbox"
                type="checkbox"
                checked={phone.verify}
                onChange={(e) => {
                  const updatedPhones = [...contact.phones];
                  updatedPhones[index].verify = e.target.checked;

                  setContact((prev) => ({
                    ...prev,
                    phones: updatedPhones,
                  }));
                }}
              />
            </section>
          ))}
        </section>
      </section>

      <section className="contact_item__container">
        <section className="contact_item__title">
          <span className="contact_item--name">Uwagi:</span>
        </section>
        <section className="contact_item__context">
          <textarea
            className="contact_item__item--edit"
            value={contact.comment ? contact.comment : ""}
            onChange={(e) =>
              setContact((prev) => {
                return {
                  ...prev,
                  comment: e.target.value,
                };
              })
            }
            rows={5}
          />
        </section>
        <section className="contact_item__settings"></section>
      </section>

      <section className="contact_item__container">
        <section className="contact_item__title">
          <span className="contact_item--name">Mailing:</span>
        </section>
        <section className="contact_item__context">
          <section className="contact_item__mailing">
            <span className="contact_item__mailing--info ">
              Ile dni przed terminiem:
            </span>
            <section className="contact_item__mailing--settings">
              <IoIosArrowDown
                className="mailing-time--down"
                onClick={() => handleChangeMailingTime("down")}
              />
              <span className="mailing-time--info">{contact.mailing.time}</span>
              <IoIosArrowUp
                className="mailing-time--up"
                onClick={() => handleChangeMailingTime("up")}
              />
            </section>
          </section>
        </section>
        <section className="contact_item__settings">
          <input
            className="contact_item-checkbox"
            type="checkbox"
            checked={contact.mailing.sending}
            onChange={() =>
              setContact((prev) => {
                return {
                  ...prev,
                  mailing: {
                    ...prev.mailing,
                    sending: !prev.mailing.sending,
                  },
                };
              })
            }
          />
        </section>
      </section>

      <section className="contact_item__container--panel">
        <button
          className="action-panel--cancel"
          onClick={() => setContactItemData({})}
        >
          Anuluj
        </button>
        <button
          className="action-panel--OK"
          onClick={handleUpdateContact}
          disabled={
            isValidPhone && isValidEmail
              ? isValidPhone.includes(false) || isValidEmail.includes(false)
              : null
          }
        >
          Zapisz
        </button>
      </section>
    </section>
  );
};

export default ContactItem;
