import React from 'react';

const InstructionChangeData = () => {
    return (
        <section className='instruction_custom'>
            <section className='instruction_custom-title'>
                <label>Dodaj lub zmień dane dla struktury organizacji.</label>
            </section>
            <section className='instruction_custom-content'>
                <span className='instruction_component-content--text'>System wymaga uprzedniego zdefiniowania struktury organizacyjnej, obejmującej odpowiednie lokalizacje, właścicieli (ownerów), obszary oraz inne kluczowe elementy. Przygotowanie tej struktury jest niezbędne do prawidłowego działania systemu.
                </span >
                <br />
                <div className='instruction_custom-image'>
                    <img src="/instruction_image/change_data_1.png" alt="Logo" className="w-32 h-auto" style={{ maxWidth: "100%" }} />
                </div>
                <br />
                <div className='instruction_custom-image'>
                    <img src="/instruction_image/change_data_2.png" alt="Logo" className="w-32 h-auto" style={{ maxWidth: "100%" }} />
                </div>
                <br />
                <span className='instruction_component-content--text'>Wszystkie te dane można edytować, usuwać i dodawać nowe zgodnie z aktualną sytuacją w firmie.
                    <br />


                </span >
                <span className='instruction_component-content--text'>Dodatkową możliwością jest dodanie procentowych celów, które będą się wyświetlały w raportach.
                </span >

            </section>
        </section>
    );
};

export default InstructionChangeData;