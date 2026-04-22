'use client'

import React, { useState, useEffect } from 'react';
import styles from './TaskPrioritizer.module.css';
import { prioritizeTasksAct } from '../app/actions';

type PriorityItem = {
  task: string;
  priority: 'High' | 'Medium' | 'Low';
  reason: string;
}

export default function TaskPrioritizer() {
  const [profile, setProfile] = useState('');
  const [situation, setSituation] = useState('');
  const [tasks, setTasks] = useState<string[]>(['', '', '']);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<PriorityItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedProfile = localStorage.getItem('ai_task_profile');
      const savedSituation = localStorage.getItem('ai_task_situation');
      if (savedProfile) setProfile(savedProfile);
      if (savedSituation) setSituation(savedSituation);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ai_task_profile', profile);
      localStorage.setItem('ai_task_situation', situation);
    }
  }, [profile, situation]);

  const handleTaskChange = (index: number, value: string) => {
    const newTasks = [...tasks];
    newTasks[index] = value;
    setTasks(newTasks);
  };

  const addTaskField = () => setTasks([...tasks, '']);
  const removeTaskField = (index: number) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    if (newTasks.length === 0) newTasks.push('');
    setTasks(newTasks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validTasks = tasks.filter(t => t.trim() !== '');
    if (validTasks.length === 0) {
      setError('Please enter at least one task.');
      return;
    }

    setError(null);
    setLoading(true);
    setResults(null);

    try {
      const data = await prioritizeTasksAct(profile, situation, validTasks);
      setResults(data.results || []);
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.formSection}>
        <div className="glass-panel">
          <div className={styles.panelContent}>
            <h2 className={styles.sectionTitle}>1. About You</h2>
            <div className={styles.inputGroup}>
              <label>Profile (Role, Job, etc.)</label>
              <input
                type="text"
                placeholder="e.g. Freelance Web Designer"
                value={profile}
                onChange={(e) => setProfile(e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Current Situation</label>
              <input
                type="text"
                placeholder="e.g. Only have 2 hours, feeling tired"
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
                className={styles.input}
              />
            </div>
          </div>
        </div>

        <div className="glass-panel">
          <div className={styles.panelContent}>
            <h2 className={styles.sectionTitle}>2. Your Tasks</h2>
            <div className={styles.taskList}>
              {tasks.map((task, index) => (
                <div key={index} className={styles.taskInputWrapper}>
                  <input
                    type="text"
                    placeholder={`Task ${index + 1}`}
                    value={task}
                    onChange={(e) => handleTaskChange(index, e.target.value)}
                    className={styles.input}
                  />
                  {tasks.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTaskField(index)}
                      className={styles.removeBtn}
                      aria-label="Remove task"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button type="button" onClick={addTaskField} className={styles.addBtn}>
              + Add another task
            </button>
          </div>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <button type="submit" disabled={loading} className={styles.submitBtn}>
          {loading ? (
            <span className={styles.loadingSpinner}></span>
          ) : (
            'Prioritize My Tasks'
          )}
        </button>
      </form>

      {results && (
        <div className={styles.resultsSection}>
          <h2 className={styles.resultsTitle}>AI Recommended Priority</h2>
          <div className={styles.cardsContainer}>
            {results.map((item, idx) => (
              <div
                key={idx}
                className={`glass-panel ${styles.resultCard} ${styles[item.priority.toLowerCase()]}`}
                style={{ animationDelay: `${idx * 0.15}s` }}
              >
                <div className={styles.cardHeader}>
                  <span className={styles.priorityBadge}>{item.priority}</span>
                  <h3>{item.task}</h3>
                </div>
                <p className={styles.reason}>{item.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
