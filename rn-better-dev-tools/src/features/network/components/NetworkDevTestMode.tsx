import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import {
  Zap,
  Send,
  Download,
  Upload,
  Trash2,
  Edit,
  Globe,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react-native";
import { gameUIColors } from "@/rn-better-dev-tools/src/shared/ui/gameUI";

interface NetworkDevTestModeProps {
  onClose?: () => void;
}

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type RequestType = "mock" | "real";

interface TestEndpoint {
  id: string;
  name: string;
  url: string;
  method: RequestMethod;
  description: string;
  type: RequestType;
  body?: any;
  headers?: Record<string, string>;
  expectedStatus?: number;
  delay?: number;
}

const MOCK_ENDPOINTS: TestEndpoint[] = [
  {
    id: "mock-success-get",
    name: "Successful GET",
    url: "https://api.mock.dev/users",
    method: "GET",
    description: "Returns 200 with user list",
    type: "mock",
    expectedStatus: 200,
    delay: 500,
  },
  {
    id: "mock-404",
    name: "404 Not Found",
    url: "https://api.mock.dev/missing",
    method: "GET",
    description: "Returns 404 error",
    type: "mock",
    expectedStatus: 404,
    delay: 300,
  },
  {
    id: "mock-500",
    name: "Server Error",
    url: "https://api.mock.dev/error",
    method: "GET",
    description: "Returns 500 internal error",
    type: "mock",
    expectedStatus: 500,
    delay: 200,
  },
  {
    id: "mock-post",
    name: "Create Resource",
    url: "https://api.mock.dev/users",
    method: "POST",
    description: "Creates new user (201)",
    type: "mock",
    body: { name: "Test User", email: "test@example.com" },
    expectedStatus: 201,
    delay: 800,
  },
  {
    id: "mock-put",
    name: "Update Resource",
    url: "https://api.mock.dev/users/123",
    method: "PUT",
    description: "Updates user data",
    type: "mock",
    body: { name: "Updated User" },
    expectedStatus: 200,
    delay: 600,
  },
  {
    id: "mock-delete",
    name: "Delete Resource",
    url: "https://api.mock.dev/users/123",
    method: "DELETE",
    description: "Deletes user (204)",
    type: "mock",
    expectedStatus: 204,
    delay: 400,
  },
  {
    id: "mock-timeout",
    name: "Request Timeout",
    url: "https://api.mock.dev/slow",
    method: "GET",
    description: "Times out after 10s",
    type: "mock",
    delay: 10000,
  },
  {
    id: "mock-large",
    name: "Large Response",
    url: "https://api.mock.dev/large-data",
    method: "GET",
    description: "Returns 5MB of JSON data",
    type: "mock",
    expectedStatus: 200,
    delay: 2000,
  },
];

const REAL_ENDPOINTS: TestEndpoint[] = [
  // SMALL RESPONSE (~1KB)
  {
    id: "real-small-get",
    name: "GET Small (1KB)",
    url: "https://httpbin.org/json",
    method: "GET",
    description: "Small JSON response ~1KB",
    type: "real",
    expectedStatus: 200,
  },
  
  // MEDIUM RESPONSE (~100KB) - Generate UUID array
  {
    id: "real-medium-get",
    name: "GET Medium (100KB)",
    url: "https://httpbin.org/uuid",
    method: "GET",
    description: "UUID response (make 100 requests for ~100KB)",
    type: "real",
    expectedStatus: 200,
  },
  
  // LARGE RESPONSE (~1MB) - JSONPlaceholder all photos
  {
    id: "real-large-get",
    name: "GET Large (~1MB)",
    url: "https://jsonplaceholder.typicode.com/photos",
    method: "GET",
    description: "5000 photos metadata ~1.2MB",
    type: "real",
    expectedStatus: 200,
  },
  
  // EXTRA LARGE RESPONSE - Generate client-side
  {
    id: "real-xlarge-get",
    name: "GET XLarge (5MB+)",
    url: "https://dummyjson.com/products?limit=100",
    method: "GET",
    description: "Products with images (will fetch multiple times)",
    type: "real",
    expectedStatus: 200,
  },
  
  // POST REQUEST
  {
    id: "real-post",
    name: "POST Request",
    url: "https://jsonplaceholder.typicode.com/posts",
    method: "POST",
    description: "Create resource (201)",
    type: "real",
    body: { 
      title: "Test Post", 
      body: "Testing POST from RN Dev Tools", 
      userId: 1,
      timestamp: Date.now()
    },
    headers: { "Content-Type": "application/json" },
    expectedStatus: 201,
  },
  
  // PUT REQUEST
  {
    id: "real-put",
    name: "PUT Request",
    url: "https://jsonplaceholder.typicode.com/posts/1",
    method: "PUT",
    description: "Update resource (200)",
    type: "real",
    body: { 
      id: 1,
      title: "Updated Post", 
      body: "Testing PUT from RN Dev Tools",
      userId: 1 
    },
    headers: { "Content-Type": "application/json" },
    expectedStatus: 200,
  },
  
  // PATCH REQUEST
  {
    id: "real-patch",
    name: "PATCH Request",
    url: "https://jsonplaceholder.typicode.com/posts/1",
    method: "PATCH",
    description: "Partial update (200)",
    type: "real",
    body: { title: "Patched Title" },
    headers: { "Content-Type": "application/json" },
    expectedStatus: 200,
  },
  
  // DELETE REQUEST
  {
    id: "real-delete",
    name: "DELETE Request",
    url: "https://jsonplaceholder.typicode.com/posts/1",
    method: "DELETE",
    description: "Delete resource (200)",
    type: "real",
    expectedStatus: 200,
  },
  
  // DELAYED RESPONSE
  {
    id: "real-slow",
    name: "Slow Response (3s)",
    url: "https://httpbin.org/delay/3",
    method: "GET",
    description: "Tests loading state (3s delay)",
    type: "real",
    expectedStatus: 200,
  },
  
  // ERROR RESPONSE
  {
    id: "real-error-404",
    name: "404 Error",
    url: "https://httpbin.org/status/404",
    method: "GET",
    description: "Tests error handling",
    type: "real",
    expectedStatus: 404,
  },
  
  // SERVER ERROR
  {
    id: "real-error-500",
    name: "500 Server Error",
    url: "https://httpbin.org/status/500",
    method: "GET",
    description: "Tests server error",
    type: "real",
    expectedStatus: 500,
  },
  
  // HEADERS TEST
  {
    id: "real-headers",
    name: "Custom Headers",
    url: "https://httpbin.org/headers",
    method: "GET",
    description: "Tests header passing",
    type: "real",
    headers: {
      "X-Custom-Header": "RN-Dev-Tools",
      "Authorization": "Bearer test-token"
    },
    expectedStatus: 200,
  },
];

export function NetworkDevTestMode({ onClose }: NetworkDevTestModeProps) {
  const [expandedSection, setExpandedSection] = useState<"mock" | "real" | "batch" | null>("mock");
  const [isRunning, setIsRunning] = useState(false);
  const [lastResults, setLastResults] = useState<Record<string, { status: number; time: number }>>({});

  const simulateMockRequest = async (endpoint: TestEndpoint) => {
    const startTime = Date.now();
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, endpoint.delay || 500));
    
    // Generate mock response based on expected status
    const status = endpoint.expectedStatus || 200;
    const time = Date.now() - startTime;
    
    // Create a fake fetch-like response
    const mockResponse = {
      ok: status >= 200 && status < 300,
      status,
      statusText: getStatusText(status),
      headers: new Headers({
        "content-type": "application/json",
        "x-mock-request": "true",
      }),
      json: async () => {
        if (status === 204) return null;
        if (status >= 400) {
          return { error: `Mock error: ${getStatusText(status)}` };
        }
        return generateMockData(endpoint);
      },
    };

    // Emit a network event that the network listener can capture
    // This will make it appear in the NetworkModal
    if (window.fetch) {
      // Trigger a real network event by making a data URI request
      // This is a hack to make the request appear in the network monitor
      const dataUri = `data:application/json,${encodeURIComponent(JSON.stringify({
        mock: true,
        endpoint: endpoint.url,
        status,
        method: endpoint.method,
      }))}`;
      
      try {
        await fetch(dataUri);
      } catch (e) {
        // Ignore errors from data URI fetch
      }
    }

    return { status, time };
  };

  const generateMockData = (endpoint: TestEndpoint) => {
    if (endpoint.id === "mock-large") {
      // Generate actual large dataset (5MB+)
      const largeArray = [];
      for (let i = 0; i < 5000; i++) {
        largeArray.push({
          id: i,
          uuid: `${i}-${Date.now()}-${Math.random().toString(36)}`,
          name: `Item ${i}`,
          description: `This is a detailed description for item ${i}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
          timestamp: new Date(Date.now() - Math.random() * 10000000).toISOString(),
          data: {
            value: Math.random() * 1000,
            status: ['active', 'inactive', 'pending'][Math.floor(Math.random() * 3)],
            tags: Array(10).fill(null).map((_, j) => `tag-${i}-${j}`),
            metrics: {
              views: Math.floor(Math.random() * 10000),
              clicks: Math.floor(Math.random() * 1000),
              conversions: Math.floor(Math.random() * 100),
            }
          },
          nested: {
            level1: {
              level2: {
                level3: {
                  deepValue: Math.random(),
                  deepArray: Array(20).fill(null).map((_, k) => ({
                    key: `deep-${k}`,
                    value: Math.random()
                  }))
                }
              }
            }
          },
          relatedItems: Array(5).fill(null).map((_, j) => ({
            id: `related-${i}-${j}`,
            title: `Related Item ${j}`,
            score: Math.random()
          }))
        });
      }
      return {
        totalItems: largeArray.length,
        sizeEstimate: "~5MB",
        generatedAt: new Date().toISOString(),
        data: largeArray
      };
    }
    
    if (endpoint.method === "GET") {
      return [
        { id: 1, name: "Mock Item 1", value: Math.random() },
        { id: 2, name: "Mock Item 2", value: Math.random() },
      ];
    }
    
    return { success: true, id: Math.floor(Math.random() * 1000) };
  };

  const getStatusText = (status: number): string => {
    const statusTexts: Record<number, string> = {
      200: "OK",
      201: "Created",
      204: "No Content",
      400: "Bad Request",
      404: "Not Found",
      418: "I'm a teapot",
      500: "Internal Server Error",
    };
    return statusTexts[status] || "Unknown";
  };

  const executeRequest = async (endpoint: TestEndpoint) => {
    setIsRunning(true);
    
    try {
      if (endpoint.type === "mock") {
        const result = await simulateMockRequest(endpoint);
        setLastResults(prev => ({ ...prev, [endpoint.id]: result }));
      } else {
        // Real request
        const startTime = Date.now();
        const options: RequestInit = {
          method: endpoint.method,
          headers: endpoint.headers || {},
        };
        
        if (endpoint.body && endpoint.method !== "GET") {
          options.body = JSON.stringify(endpoint.body);
          options.headers = {
            ...options.headers,
            "Content-Type": "application/json",
          };
        }
        
        const response = await fetch(endpoint.url, options);
        const time = Date.now() - startTime;
        
        setLastResults(prev => ({ 
          ...prev, 
          [endpoint.id]: { status: response.status, time } 
        }));
      }
    } catch (error) {
      Alert.alert("Request Error", error instanceof Error ? error.message : "Unknown error");
    } finally {
      setIsRunning(false);
    }
  };

  const runBatchTests = async (type: RequestType) => {
    setIsRunning(true);
    const endpoints = type === "mock" ? MOCK_ENDPOINTS : REAL_ENDPOINTS;
    
    for (const endpoint of endpoints) {
      await executeRequest(endpoint);
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    setIsRunning(false);
  };

  const getMethodColor = (method: RequestMethod) => {
    const colors: Record<RequestMethod, string> = {
      GET: gameUIColors.success,
      POST: gameUIColors.info,
      PUT: gameUIColors.warning,
      DELETE: gameUIColors.critical,
      PATCH: gameUIColors.optional,
    };
    return colors[method];
  };

  const getStatusIcon = (status?: number) => {
    if (!status) return null;
    
    if (status >= 200 && status < 300) {
      return <CheckCircle size={12} color={gameUIColors.success} />;
    } else if (status >= 400 && status < 500) {
      return <AlertCircle size={12} color={gameUIColors.warning} />;
    } else if (status >= 500) {
      return <XCircle size={12} color={gameUIColors.critical} />;
    }
    return <Clock size={12} color={gameUIColors.muted} />;
  };

  const renderEndpointList = (endpoints: TestEndpoint[], type: RequestType) => {
    const isExpanded = expandedSection === type;
    
    return (
      <View style={styles.section}>
        <TouchableOpacity
          onPress={() => setExpandedSection(isExpanded ? null : type)}
          style={styles.sectionHeader}
        >
          <View style={styles.sectionTitle}>
            <Globe size={14} color={type === "mock" ? gameUIColors.info : gameUIColors.success} />
            <Text style={styles.sectionTitleText}>
              {type === "mock" ? "MOCK REQUESTS" : "REAL API TESTS"}
            </Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{endpoints.length}</Text>
            </View>
          </View>
          {isExpanded ? (
            <ChevronUp size={14} color={gameUIColors.muted} />
          ) : (
            <ChevronDown size={14} color={gameUIColors.muted} />
          )}
        </TouchableOpacity>

        {isExpanded && (
          <Animated.View entering={FadeIn.duration(200)}>
            <TouchableOpacity
              onPress={() => runBatchTests(type)}
              style={styles.batchButton}
              disabled={isRunning}
            >
              <RefreshCw size={12} color={gameUIColors.primary} />
              <Text style={styles.batchButtonText}>RUN ALL {type.toUpperCase()} TESTS</Text>
            </TouchableOpacity>

            {endpoints.map((endpoint) => {
              const result = lastResults[endpoint.id];
              
              return (
                <TouchableOpacity
                  key={endpoint.id}
                  onPress={() => executeRequest(endpoint)}
                  style={styles.endpoint}
                  disabled={isRunning}
                >
                  <View style={styles.endpointHeader}>
                    <View style={[styles.methodBadge, { backgroundColor: getMethodColor(endpoint.method) + "20" }]}>
                      <Text style={[styles.methodText, { color: getMethodColor(endpoint.method) }]}>
                        {endpoint.method}
                      </Text>
                    </View>
                    <Text style={styles.endpointName} numberOfLines={1}>
                      {endpoint.name}
                    </Text>
                    {result && (
                      <View style={styles.resultBadge}>
                        {getStatusIcon(result.status)}
                        <Text style={styles.resultText}>{result.status}</Text>
                        <Text style={styles.timeText}>{result.time}ms</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.endpointUrl} numberOfLines={1}>
                    {endpoint.url}
                  </Text>
                  <Text style={styles.endpointDesc}>{endpoint.description}</Text>
                </TouchableOpacity>
              );
            })}
          </Animated.View>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Zap size={14} color={gameUIColors.critical} />
          <Text style={styles.title}>NETWORK DEV TEST MODE</Text>
        </View>
        <Text style={styles.subtitle}>
          Generate mock and real network requests for testing
        </Text>
      </View>

      {renderEndpointList(MOCK_ENDPOINTS, "mock")}
      {renderEndpointList(REAL_ENDPOINTS, "real")}

      <View style={styles.section}>
        <TouchableOpacity
          onPress={() => setExpandedSection(expandedSection === "batch" ? null : "batch")}
          style={styles.sectionHeader}
        >
          <View style={styles.sectionTitle}>
            <RefreshCw size={14} color={gameUIColors.warning} />
            <Text style={styles.sectionTitleText}>BATCH OPERATIONS</Text>
          </View>
          {expandedSection === "batch" ? (
            <ChevronUp size={14} color={gameUIColors.muted} />
          ) : (
            <ChevronDown size={14} color={gameUIColors.muted} />
          )}
        </TouchableOpacity>

        {expandedSection === "batch" && (
          <Animated.View entering={FadeIn.duration(200)} style={styles.batchSection}>
            <TouchableOpacity
              onPress={() => runBatchTests("mock")}
              style={[styles.bigButton, { backgroundColor: gameUIColors.info + "1A" }]}
              disabled={isRunning}
            >
              <Send size={16} color={gameUIColors.info} />
              <Text style={[styles.bigButtonText, { color: gameUIColors.info }]}>
                FIRE ALL MOCK REQUESTS
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => runBatchTests("real")}
              style={[styles.bigButton, { backgroundColor: gameUIColors.success + "1A" }]}
              disabled={isRunning}
            >
              <Globe size={16} color={gameUIColors.success} />
              <Text style={[styles.bigButtonText, { color: gameUIColors.success }]}>
                FIRE ALL REAL REQUESTS
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={async () => {
                await runBatchTests("mock");
                await runBatchTests("real");
              }}
              style={[styles.bigButton, { backgroundColor: gameUIColors.warning + "1A" }]}
              disabled={isRunning}
            >
              <Zap size={16} color={gameUIColors.warning} />
              <Text style={[styles.bigButtonText, { color: gameUIColors.warning }]}>
                STRESS TEST - ALL REQUESTS
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>

      <View style={styles.info}>
        <AlertCircle size={12} color={gameUIColors.muted} />
        <Text style={styles.infoText}>
          Mock requests simulate network activity. Real requests hit actual APIs.
          Check the main network list to see captured requests.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  title: {
    fontSize: 12,
    color: gameUIColors.critical,
    fontFamily: "monospace",
    fontWeight: "700",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 10,
    color: gameUIColors.secondary,
    fontFamily: "monospace",
    marginLeft: 22,
  },
  section: {
    marginBottom: 12,
    backgroundColor: gameUIColors.panel,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: gameUIColors.border,
    overflow: "hidden",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: gameUIColors.background + "66",
  },
  sectionTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitleText: {
    fontSize: 11,
    color: gameUIColors.primary,
    fontFamily: "monospace",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  badge: {
    backgroundColor: gameUIColors.info + "20",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 9,
    color: gameUIColors.info,
    fontFamily: "monospace",
    fontWeight: "600",
  },
  batchButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: 8,
    marginHorizontal: 8,
    marginTop: 4,
    marginBottom: 8,
    backgroundColor: gameUIColors.primary + "0D",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: gameUIColors.primary + "33",
  },
  batchButtonText: {
    fontSize: 10,
    color: gameUIColors.primary,
    fontFamily: "monospace",
    fontWeight: "600",
  },
  endpoint: {
    padding: 10,
    marginHorizontal: 8,
    marginBottom: 6,
    backgroundColor: gameUIColors.background + "33",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: gameUIColors.border + "33",
  },
  endpointHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  methodBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  methodText: {
    fontSize: 9,
    fontFamily: "monospace",
    fontWeight: "700",
  },
  endpointName: {
    fontSize: 11,
    color: gameUIColors.primary,
    fontFamily: "monospace",
    fontWeight: "600",
    flex: 1,
  },
  resultBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: gameUIColors.background + "66",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  resultText: {
    fontSize: 9,
    color: gameUIColors.primary,
    fontFamily: "monospace",
    fontWeight: "600",
  },
  timeText: {
    fontSize: 8,
    color: gameUIColors.muted,
    fontFamily: "monospace",
  },
  endpointUrl: {
    fontSize: 9,
    color: gameUIColors.muted,
    fontFamily: "monospace",
    marginBottom: 2,
  },
  endpointDesc: {
    fontSize: 9,
    color: gameUIColors.secondary,
    fontFamily: "monospace",
  },
  batchSection: {
    padding: 12,
    gap: 8,
  },
  bigButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: gameUIColors.border,
  },
  bigButtonText: {
    fontSize: 11,
    fontFamily: "monospace",
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  info: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    padding: 12,
    marginTop: 8,
    backgroundColor: gameUIColors.muted + "0D",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: gameUIColors.muted + "33",
  },
  infoText: {
    fontSize: 9,
    color: gameUIColors.muted,
    fontFamily: "monospace",
    flex: 1,
    lineHeight: 14,
  },
});