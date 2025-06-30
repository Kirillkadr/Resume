import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import html2pdf from 'html2pdf.js';
import './index.css';

const initialSections = [
  { id: '1', type: 'about', content: { title: 'О себе', description: 'Краткое описание вашей профессиональной деятельности' } },
];

const ResumeEditor = () => {
  const [sections, setSections] = useState(() => {
    const saved = localStorage.getItem('resume');
    return saved ? JSON.parse(saved) : initialSections;
  });
  const [theme, setTheme] = useState({ color: 'blue', font: 'Arial' });

  useEffect(() => {
    localStorage.setItem('resume', JSON.stringify(sections));
  }, [sections]);

  const addSection = (type) => {
    const newSection = {
      id: Date.now().toString(),
      type,
      content: getDefaultContent(type),
    };
    setSections([...sections, newSection]);
  };

  const getDefaultContent = (type) => {
    switch (type) {
      case 'experience': return { position: '', company: '', period: '', description: '' };
      case 'education': return { institution: '', degree: '', period: '' };
      case 'skills': return { skills: '' };
      case 'certificates': return { name: '', issuer: '', date: '' };
      case 'about': return { title: 'О себе', description: '' };
      default: return {};
    }
  };

  const updateSection = (id, content) => {
    setSections(sections.map(section =>
      section.id === id ? { ...section, content } : section
    ));
  };

  const deleteSection = (id) => {
    setSections(sections.filter(section => section.id !== id));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(sections);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setSections(reordered);
  };

  const getAiSuggestion = (type) => {
    const suggestions = {
      experience: { description: 'Разработал масштабируемые веб-приложения, оптимизировал производительность на 30%' },
      about: { description: 'Целеустремленный разработчик с 5+ годами опыта в создании современных веб-приложений' },
    };
    return suggestions[type] || {};
  };

  const downloadPDF = () => {
    const element = document.getElementById('preview');
    html2pdf().from(element).save('resume.pdf');
  };

  const renderForm = (section) => {
    switch (section.type) {
      case 'experience':
        return (
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Должность"
              value={section.content.position}
              onChange={(e) => updateSection(section.id, { ...section.content, position: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Компания"
              value={section.content.company}
              onChange={(e) => updateSection(section.id, { ...section.content, company: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Период"
              value={section.content.period}
              onChange={(e) => updateSection(section.id, { ...section.content, period: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <textarea
              placeholder="Описание"
              value={section.content.description}
              onChange={(e) => updateSection(section.id, { ...section.content, description: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <button
              onClick={() => updateSection(section.id, { ...section.content, ...getAiSuggestion(section.type) })}
              className="p-2 bg-gray-200 rounded"
            >
              AI-подсказка
            </button>
          </div>
        );
      case 'education':
        return (
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Учебное заведение"
              value={section.content.institution}
              onChange={(e) => updateSection(section.id, { ...section.content, institution: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Специальность"
              value={section.content.degree}
              onChange={(e) => updateSection(section.id, { ...section.content, degree: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Период"
              value={section.content.period}
              onChange={(e) => updateSection(section.id, { ...section.content, period: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
        );
      case 'skills':
        return (
          <textarea
            placeholder="Навыки (через запятую)"
            value={section.content.skills}
            onChange={(e) => updateSection(section.id, { ...section.content, skills: e.target.value })}
            className="w-full p-2 border rounded"
          />
        );
      case 'certificates':
        return (
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Название сертификата"
              value={section.content.name}
              onChange={(e) => updateSection(section.id, { ...section.content, name: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Организация"
              value={section.content.issuer}
              onChange={(e) => updateSection(section.id, { ...section.content, issuer: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Дата"
              value={section.content.date}
              onChange={(e) => updateSection(section.id, { ...section.content, date: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
        );
      case 'about':
        return (
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Заголовок"
              value={section.content.title}
              onChange={(e) => updateSection(section.id, { ...section.content, title: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <textarea
              placeholder="Описание"
              value={section.content.description}
              onChange={(e) => updateSection(section.id, { ...section.content, description: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <button
              onClick={() => updateSection(section.id, { ...section.content, ...getAiSuggestion(section.type) })}
              className="p-2 bg-gray-200 rounded"
            >
              AI-подсказка
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  const renderPreview = (section) => {
    switch (section.type) {
      case 'experience':
        return (
          <div className="mb-4">
            <h3 className={`text-lg font-bold text-${theme.color}-600`}>{section.content.position}</h3>
            <p>{section.content.company} | {section.content.period}</p>
            <p>{section.content.description}</p>
          </div>
        );
      case 'education':
        return (
          <div className="mb-4">
            <h3 className={`text-lg font-bold text-${theme.color}-600`}>{section.content.degree}</h3>
            <p>{section.content.institution} | {section.content.period}</p>
          </div>
        );
      case 'skills':
        return (
          <div className="mb-4">
            <h3 className={`text-lg font-bold text-${theme.color}-600`}>Навыки</h3>
            <p>{section.content.skills}</p>
          </div>
        );
      case 'certificates':
        return (
          <div className="mb-4">
            <h3 className={`text-lg font-bold text-${theme.color}-600`}>{section.content.name}</h3>
            <p>{section.content.issuer} | {section.content.date}</p>
          </div>
        );
      case 'about':
        return (
          <div className="mb-4">
            <h3 className={`text-lg font-bold text-${theme.color}-600`}>{section.content.title}</h3>
            <p>{section.content.description}</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen p-4">
      <div className="w-1/2 p-4 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Редактор резюме</h2>
        <select
          onChange={(e) => addSection(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        >
          <option value="">Добавить секцию</option>
          <option value="about">О себе</option>
          <option value="experience">Опыт</option>
          <option value="education">Образование</option>
          <option value="skills">Навыки</option>
          <option value="certificates">Сертификаты</option>
        </select>
        <div className="mb-4">
          <label className="mr-2">Цвет:</label>
          <select
            onChange={(e) => setTheme({ ...theme, color: e.target.value })}
            className="p-2 border rounded"
          >
            <option value="blue">Синий</option>
            <option value="green">Зеленый</option>
            <option value="red">Красный</option>
          </select>
          <label className="ml-4 mr-2">Шрифт:</label>
          <select
            onChange={(e) => setTheme({ ...theme, font: e.target.value })}
            className="p-2 border rounded"
          >
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Helvetica">Helvetica</option>
          </select>
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="sections">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {sections.map((section, index) => (
                  <Draggable key={section.id} draggableId={section.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="p-4 mb-2 bg-gray-100 rounded"
                      >
                        <div className="flex justify-between">
                          <h3 className="text-lg font-bold">{section.type}</h3>
                          <button
                            onClick={() => deleteSection(section.id)}
                            className="text-red-500"
                          >
                            Удалить
                          </button>
                        </div>
                        {renderForm(section)}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <button
          onClick={downloadPDF}
          className="mt-4 p-2 bg-blue-500 text-white rounded"
        >
          Скачать PDF
        </button>
      </div>
      <div
        id="preview"
        className="w-1/2 p-4 bg-white border shadow overflow-y-auto"
        style={{ fontFamily: theme.font }}
      >
        <h2 className="text-2xl font-bold mb-4">Превью резюме</h2>
        {sections.map(section => (
          <div key={section.id}>{renderPreview(section)}</div>
        ))}
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(<ResumeEditor />);