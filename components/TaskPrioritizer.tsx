'use client'

import React, { useState } from 'react';
import styles from './TaskPrioritizer.module.css';
import { prioritizeTasksAct } from '../app/actions';

type PriorityItem = {
  task: string;
  priority: 'High' | 'Medium' | 'Low';
  reason: string;
}

const PRIORITY_LABEL_JA: Record<string, string> = {
  High: '高',
  Medium: '中',
  Low: '低',
};

export default function TaskPrioritizer() {
  const [profile, setProfile] = useState('');
  const [situation, setSituation] = useState('');
  const [tasks, setTasks] = useState<string[]>(['', '', '']);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<PriorityItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);



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
      setError('少なくとも1つタスクを入力してください。');
      return;
    }

    setError(null);
    setLoading(true);
    setResults(null);

    try {
      const data = await prioritizeTasksAct(profile, situation, validTasks);
      setResults(data.results || []);
    } catch (err: any) {
      setError(err.message || 'エラーが発生しました。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.formSection}>
        <div className="glass-panel">
          <div className={styles.panelContent}>
            <h2 className={styles.sectionTitle}>1. あなたについて</h2>
            <div className={styles.inputGroup}>
              <label>プロフィール（役職・職種など）</label>
              <input
                type="text"
                placeholder="例：フリーランスのWebデザイナー"
                value={profile}
                onChange={(e) => setProfile(e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>現在の状況</label>
              <input
                type="text"
                placeholder="例：残り2時間しかない、少し疲れている"
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
                className={styles.input}
              />
            </div>
          </div>
        </div>

        <div className="glass-panel">
          <div className={styles.panelContent}>
            <h2 className={styles.sectionTitle}>2. タスク一覧</h2>
            <div className={styles.taskList}>
              {tasks.map((task, index) => (
                <div key={index} className={styles.taskInputWrapper}>
                  <input
                    type="text"
                    placeholder={`タスク ${index + 1}`}
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
              ＋ タスクを追加
            </button>
          </div>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <button type="submit" disabled={loading} className={styles.submitBtn}>
          {loading ? (
            <span className={styles.loadingSpinner}></span>
          ) : (
            'AIで優先順位をつける'
          )}
        </button>
      </form>

      {results && (
        <div className={styles.resultsSection}>
          <h2 className={styles.resultsTitle}>AIが判定した優先順位</h2>
          <div className={styles.cardsContainer}>
            {results.map((item, idx) => (
              <div
                key={idx}
                className={`glass-panel ${styles.resultCard} ${styles[item.priority.toLowerCase()]}`}
                style={{ animationDelay: `${idx * 0.15}s` }}
              >
                <div className={styles.cardHeader}>
                  <span className={styles.priorityBadge}>{PRIORITY_LABEL_JA[item.priority] ?? item.priority}</span>
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
