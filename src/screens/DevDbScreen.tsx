import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as SQLite from 'expo-sqlite';
import { screenStyles } from '../styles/screenStyles';

export default function DevDbScreen() {
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [columns, setColumns] = useState<any[]>([]);
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<any[]>([]);
  const [status, setStatus] = useState<{ message: string; rowsAffected?: number; isError: boolean } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchTables();
  }, []);

  async function fetchTables() {
    setIsLoading(true);
    try {
      const db = await SQLite.openDatabaseAsync('scheduler.db');
      const stmt = await db.prepareAsync("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';");
      try {
        const result = await stmt.executeAsync();
        const rows = [];
        for await (const row of result) {
          rows.push(row);
        }
        setTables(rows.map((row: any) => row.name));
      } finally {
        await stmt.finalizeAsync();
      }
    } catch (error: any) {
      Alert.alert('Error fetching tables', error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchColumns(tableName: string) {
    setIsLoading(true);
    setSelectedTable(tableName);
    try {
      const db = await SQLite.openDatabaseAsync('scheduler.db');
      const stmt = await db.prepareAsync(`PRAGMA table_info('${tableName}');`);
      try {
        const result = await stmt.executeAsync();
        const rows = [];
        for await (const row of result) {
          rows.push(row);
        }
        setColumns(rows);
      } finally {
        await stmt.finalizeAsync();
      }
    } catch (error: any) {
      Alert.alert('Error fetching columns', error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function clearTable() {
    if (!selectedTable) return;

    Alert.alert(
      'Confirm Clear Table',
      `Are you sure you want to clear all data from the table "${selectedTable}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            setStatus(null);
            try {
              const db = await SQLite.openDatabaseAsync('scheduler.db');
              const result = await db.runAsync(`DELETE FROM '${selectedTable}';`);
              setStatus({
                message: `Table ${selectedTable} cleared successfully`,
                rowsAffected: result.changes,
                isError: false,
              });
              setResults([]);
            } catch (error: any) {
              Alert.alert('Error clearing table', error.message);
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  }

  async function executeQuery() {
    if (!query.trim()) return;

    setIsLoading(true);
    setResults([]);
    setStatus(null);

    try {
      const db = await SQLite.openDatabaseAsync('scheduler.db');
      const normalizedQuery = query.trim().toUpperCase();

      if (normalizedQuery.startsWith('SELECT') || normalizedQuery.startsWith('PRAGMA')) {
        const stmt = await db.prepareAsync(query);
        try {
          const result = await stmt.executeAsync();
          const rows = [];
          for await (const row of result) {
            rows.push(row);
          }
          setResults(rows);
          setStatus({
            message: `Returned ${rows.length} rows`,
            isError: false,
          });
        } finally {
          await stmt.finalizeAsync();
        }
      } else {
        const result = await db.runAsync(query);
        setStatus({
          message: `Query executed successfully`,
          rowsAffected: result.changes,
          isError: false,
        });
      }
    } catch (error: any) {
      setStatus({
        message: error.message,
        isError: true,
      });
    } finally {
      setIsLoading(false);
    }
  }

  const renderResultsTable = () => {
    if (results.length === 0) return null;

    const headers = Object.keys(results[0]);

    return (
      <ScrollView horizontal>
        <View>
          <View style={styles.tableHeaderRow}>
            {headers.map((header) => (
              <View key={header} style={styles.tableHeaderCell}>
                <Text style={styles.tableHeaderText}>{header}</Text>
              </View>
            ))}
          </View>
          <FlatList
            data={results}
            scrollEnabled={false}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item: row }) => (
              <View style={styles.tableRow}>
                {headers.map((header) => (
                  <View key={header} style={styles.tableCell}>
                    <Text style={styles.tableCellText}>{String(row[header])}</Text>
                  </View>
                ))}
              </View>
            )}
          />
        </View>
      </ScrollView>
    );
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#f5f5f5' }}
      contentContainerStyle={{ padding: 20 }}
    >

      {/* Schema Exploration */}
      <View style={screenStyles.card}>
        <Text style={styles.sectionTitle}>Schema Explorer</Text>
        <View style={styles.tableList}>
          {tables.map((table) => (
            <TouchableOpacity
              key={table}
              style={[styles.tableButton, selectedTable === table && styles.tableButtonActive]}
              onPress={() => fetchColumns(table)}
            >
              <Text style={[styles.tableButtonText, selectedTable === table && styles.tableButtonTextActive]}>
                {table}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedTable && (
          <View style={styles.columnList}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <Text style={styles.columnTitle}>Columns for {selectedTable}:</Text>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={clearTable}
                disabled={isLoading}
              >
                <Text style={styles.clearButtonText}>Clear Table</Text>
              </TouchableOpacity>
            </View>
            {columns.map((col, index) => (
              <View key={index} style={styles.columnItem}>
                <Text style={styles.columnName}>{col.name}</Text>
                <Text style={styles.columnType}>{col.type} {col.pk ? '(PK)' : ''} {col.notnull ? 'NOT NULL' : ''}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* SQL Editor */}
      <View style={screenStyles.card}>
        <Text style={styles.sectionTitle}>SQL Editor</Text>
        <TextInput
          style={styles.sqlInput}
          placeholder="Enter SQL query..."
          value={query}
          onChangeText={setQuery}
          multiline
          textAlignVertical="top"
        />
        <TouchableOpacity
          style={styles.executeButton}
          onPress={executeQuery}
          disabled={isLoading}
        >
          {isLoading ? <ActivityIndicator color="white" /> : <Text style={styles.executeButtonText}>Execute</Text>}
        </TouchableOpacity>
      </View>

      {/* Results Viewer */}
      <View style={screenStyles.card}>
        <Text style={styles.sectionTitle}>Results</Text>
        {status && (
          <Text style={[styles.statusText, status.isError ? styles.errorText : styles.successText]}>
            {status.isError ? `Error: ${status.message}` :
             status.rowsAffected !== undefined ? `Rows affected: ${status.rowsAffected}` :
             status.message}
          </Text>
        )}
        {renderResultsTable()}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#555',
  },
  tableList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 15,
  },
  tableButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  tableButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#0056b3',
  },
  tableButtonText: {
    fontSize: 14,
    color: '#333',
  },
  tableButtonTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  columnList: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  columnTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
    color: '#666',
  },
  columnItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  columnName: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  columnType: {
    fontSize: 12,
    color: '#888',
  },
  sqlInput: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
    fontFamily: 'Courier New', // Monospace font
    fontSize: 14,
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
    color: '#333',
  },
  executeButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  executeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 14,
    marginBottom: 10,
    fontWeight: '500',
  },
  successText: {
    color: 'green',
  },
  errorText: {
    color: 'red',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#eee',
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
  },
  tableHeaderCell: {
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: '#ccc',
    minWidth: 100,
  },
  tableHeaderText: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#333',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tableCell: {
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: '#eee',
    minWidth: 100,
  },
  tableCellText: {
    fontSize: 12,
    color: '#666',
  },
  clearButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
