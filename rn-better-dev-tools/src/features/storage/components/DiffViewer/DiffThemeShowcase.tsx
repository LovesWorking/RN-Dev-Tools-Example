import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Dimensions,
} from "react-native";
import { ThemedSplitView } from "./modes/ThemedSplitView";
import { diffThemes, DiffThemeKey } from "./themes/diffThemes";
import { DiffOptions } from "./DiffOptionsPanel";
import { gameUIColors } from "@/rn-better-dev-tools/src/shared/ui/gameUI";
import StandaloneDiffViewer from "./StandaloneDiffViewer";

const { width: screenWidth } = Dimensions.get("window");

// Realistic test data for different app scenarios
const mockDataSets = {
  userProfile: {
    name: "User Profile",
    description: "Common user account changes",
    old: {
      id: "usr_2N4ORyA0BFogxQ1sJkQr",
      email: "sarah.johnson@company.com",
      displayName: "Sarah Johnson",
      avatar: "https://cdn.company.com/avatars/default.png",
      role: "developer",
      permissions: ["read:code", "write:code", "read:docs"],
      settings: {
        theme: "dark",
        language: "en",
        timezone: "America/New_York",
        notifications: {
          email: true,
          push: false,
          slack: true,
          frequency: "instant",
        },
        security: {
          twoFactorEnabled: false,
          lastPasswordChange: "2024-01-15T10:30:00Z",
          sessions: 3,
        },
      },
      metadata: {
        createdAt: "2023-06-15T08:00:00Z",
        lastLogin: "2024-12-01T09:15:00Z",
        loginCount: 487,
        subscription: "pro",
        billingCycle: "monthly",
      },
    },
    new: {
      id: "usr_2N4ORyA0BFogxQ1sJkQr",
      email: "sarah.johnson@company.com",
      displayName: "Sarah J. Johnson",
      avatar: "https://cdn.company.com/avatars/sarah_2024.jpg",
      role: "senior_developer",
      permissions: [
        "read:code",
        "write:code",
        "read:docs",
        "admin:team",
        "deploy:staging",
      ],
      settings: {
        theme: "cyberpunk",
        language: "en",
        timezone: "America/Los_Angeles",
        notifications: {
          email: true,
          push: true,
          slack: true,
          frequency: "daily_digest",
          webhooks: ["https://hooks.company.com/user/notify"],
        },
        security: {
          twoFactorEnabled: true,
          twoFactorMethod: "authenticator",
          lastPasswordChange: "2024-11-20T14:22:00Z",
          sessions: 5,
          trustedDevices: 2,
        },
        preferences: {
          codeEditor: "vscode",
          aiAssistant: true,
        },
      },
      metadata: {
        createdAt: "2023-06-15T08:00:00Z",
        lastLogin: "2024-12-15T11:30:00Z",
        loginCount: 523,
        subscription: "enterprise",
        billingCycle: "annual",
        team: "engineering-core",
      },
    },
  },
  apiResponse: {
    name: "API Response",
    description: "REST API response changes",
    old: {
      status: "success",
      data: {
        products: [
          {
            id: "prod_001",
            name: "Premium Widget",
            price: 29.99,
            currency: "USD",
            stock: 150,
            categories: ["electronics", "gadgets"],
            ratings: { average: 4.5, count: 234 },
            shipping: { free: false, cost: 5.99, days: 3 },
          },
          {
            id: "prod_002",
            name: "Standard Widget",
            price: 19.99,
            currency: "USD",
            stock: 500,
            categories: ["electronics"],
            ratings: { average: 4.2, count: 89 },
          },
        ],
        pagination: {
          page: 1,
          perPage: 20,
          total: 2,
          hasMore: false,
        },
      },
      meta: {
        requestId: "req_7hY4kL9mN2",
        timestamp: "2024-12-01T10:00:00Z",
        version: "v1",
      },
    },
    new: {
      status: "success",
      data: {
        products: [
          {
            id: "prod_001",
            sku: "WDG-PRM-001",
            name: "Premium Widget Pro",
            price: 34.99,
            originalPrice: 39.99,
            currency: "USD",
            stock: 89,
            categories: ["electronics", "gadgets", "premium"],
            ratings: {
              average: 4.6,
              count: 312,
              distribution: { 5: 201, 4: 89, 3: 15, 2: 5, 1: 2 },
            },
            shipping: { free: true, cost: 0, days: 2, express: true },
            images: ["widget_pro_1.jpg", "widget_pro_2.jpg"],
            inStock: true,
          },
          {
            id: "prod_002",
            sku: "WDG-STD-002",
            name: "Standard Widget",
            price: 19.99,
            currency: "USD",
            stock: 0,
            categories: ["electronics", "clearance"],
            ratings: { average: 4.2, count: 89 },
            shipping: { free: false, cost: 7.99, days: 5 },
            inStock: false,
            nextRestock: "2024-12-20T00:00:00Z",
          },
          {
            id: "prod_003",
            sku: "WDG-NEW-003",
            name: "Widget Mini",
            price: 9.99,
            currency: "USD",
            stock: 1000,
            categories: ["electronics", "new"],
            ratings: { average: 0, count: 0 },
            shipping: { free: false, cost: 3.99, days: 7 },
            inStock: true,
            isNew: true,
          },
        ],
        pagination: {
          page: 1,
          perPage: 20,
          total: 3,
          totalPages: 1,
          hasMore: false,
          nextCursor: null,
        },
        filters: {
          applied: ["inStock", "category:electronics"],
          available: ["price", "rating", "shipping"],
        },
      },
      meta: {
        requestId: "req_9kL3mN8pQ5",
        timestamp: "2024-12-15T14:30:00Z",
        version: "v2",
        responseTime: 145,
        cache: "miss",
      },
    },
  },
  databaseSchema: {
    name: "DB Schema",
    description: "Database migration changes",
    old: {
      tables: {
        users: {
          columns: {
            id: { type: "uuid", primaryKey: true },
            email: { type: "varchar(255)", unique: true, notNull: true },
            password_hash: { type: "varchar(255)", notNull: true },
            created_at: { type: "timestamp", default: "CURRENT_TIMESTAMP" },
            updated_at: { type: "timestamp" },
          },
          indexes: ["email"],
          constraints: [],
        },
        posts: {
          columns: {
            id: { type: "serial", primaryKey: true },
            user_id: { type: "uuid", notNull: true },
            title: { type: "varchar(200)", notNull: true },
            content: { type: "text" },
            published: { type: "boolean", default: false },
            created_at: { type: "timestamp", default: "CURRENT_TIMESTAMP" },
          },
          indexes: ["user_id", "published"],
          constraints: [
            {
              type: "foreign_key",
              column: "user_id",
              references: "users.id",
              onDelete: "CASCADE",
            },
          ],
        },
      },
      version: "1.0.0",
    },
    new: {
      tables: {
        users: {
          columns: {
            id: {
              type: "uuid",
              primaryKey: true,
              default: "gen_random_uuid()",
            },
            email: { type: "varchar(255)", unique: true, notNull: true },
            username: { type: "varchar(50)", unique: true, notNull: true },
            password_hash: { type: "varchar(255)", notNull: true },
            email_verified: { type: "boolean", default: false },
            role: {
              type: "enum",
              values: ["user", "admin", "moderator"],
              default: "user",
            },
            created_at: { type: "timestamp", default: "CURRENT_TIMESTAMP" },
            updated_at: {
              type: "timestamp",
              default: "CURRENT_TIMESTAMP",
              onUpdate: "CURRENT_TIMESTAMP",
            },
            deleted_at: { type: "timestamp", nullable: true },
          },
          indexes: ["email", "username", "role", "deleted_at"],
          constraints: [],
          triggers: [
            {
              name: "update_updated_at",
              event: "BEFORE UPDATE",
              action: "SET NEW.updated_at = NOW()",
            },
          ],
        },
        posts: {
          columns: {
            id: {
              type: "uuid",
              primaryKey: true,
              default: "gen_random_uuid()",
            },
            user_id: { type: "uuid", notNull: true },
            title: { type: "varchar(200)", notNull: true },
            slug: { type: "varchar(250)", unique: true, notNull: true },
            content: { type: "text" },
            excerpt: { type: "varchar(500)" },
            published: { type: "boolean", default: false },
            published_at: { type: "timestamp", nullable: true },
            view_count: { type: "integer", default: 0 },
            tags: { type: "jsonb", default: "[]" },
            created_at: { type: "timestamp", default: "CURRENT_TIMESTAMP" },
            updated_at: {
              type: "timestamp",
              default: "CURRENT_TIMESTAMP",
              onUpdate: "CURRENT_TIMESTAMP",
            },
          },
          indexes: [
            "user_id",
            "published",
            "slug",
            {
              name: "idx_published_at",
              columns: ["published_at"],
              where: "published = true",
            },
            { name: "idx_tags", columns: ["tags"], type: "gin" },
          ],
          constraints: [
            {
              type: "foreign_key",
              column: "user_id",
              references: "users.id",
              onDelete: "CASCADE",
            },
          ],
        },
        comments: {
          columns: {
            id: {
              type: "uuid",
              primaryKey: true,
              default: "gen_random_uuid()",
            },
            post_id: { type: "uuid", notNull: true },
            user_id: { type: "uuid", notNull: true },
            parent_id: { type: "uuid", nullable: true },
            content: { type: "text", notNull: true },
            approved: { type: "boolean", default: false },
            created_at: { type: "timestamp", default: "CURRENT_TIMESTAMP" },
            updated_at: {
              type: "timestamp",
              default: "CURRENT_TIMESTAMP",
              onUpdate: "CURRENT_TIMESTAMP",
            },
          },
          indexes: ["post_id", "user_id", "parent_id", "approved"],
          constraints: [
            {
              type: "foreign_key",
              column: "post_id",
              references: "posts.id",
              onDelete: "CASCADE",
            },
            {
              type: "foreign_key",
              column: "user_id",
              references: "users.id",
              onDelete: "CASCADE",
            },
            {
              type: "foreign_key",
              column: "parent_id",
              references: "comments.id",
              onDelete: "CASCADE",
            },
          ],
        },
      },
      version: "2.0.0",
      migrations: [
        "add_username_to_users",
        "add_soft_delete_to_users",
        "create_comments_table",
        "add_tags_and_slug_to_posts",
      ],
    },
  },
  configFile: {
    name: "Config File",
    description: "Application configuration changes",
    old: {
      app: {
        name: "MyApp",
        version: "1.2.3",
        environment: "development",
        debug: true,
        logLevel: "debug",
      },
      server: {
        host: "localhost",
        port: 3000,
        ssl: false,
        cors: {
          enabled: true,
          origins: ["http://localhost:3000"],
        },
      },
      database: {
        type: "postgresql",
        host: "localhost",
        port: 5432,
        database: "myapp_dev",
        username: "dev_user",
        poolSize: 10,
        ssl: false,
      },
      redis: {
        host: "localhost",
        port: 6379,
        db: 0,
      },
      auth: {
        jwtSecret: "dev-secret-key-change-in-production",
        sessionTimeout: 3600,
        refreshTokenExpiry: 604800,
        providers: ["local"],
      },
      storage: {
        type: "local",
        path: "./uploads",
        maxFileSize: 10485760,
      },
      email: {
        provider: "smtp",
        host: "localhost",
        port: 1025,
        secure: false,
      },
    },
    new: {
      app: {
        name: "MyApp",
        version: "2.0.1",
        environment: "production",
        debug: false,
        logLevel: "error",
        domain: "https://myapp.com",
        cdnUrl: "https://cdn.myapp.com",
      },
      server: {
        host: "0.0.0.0",
        port: 443,
        ssl: true,
        sslCert: "/etc/ssl/certs/myapp.crt",
        sslKey: "/etc/ssl/private/myapp.key",
        cors: {
          enabled: true,
          origins: ["https://myapp.com", "https://www.myapp.com"],
          credentials: true,
        },
        rateLimit: {
          enabled: true,
          windowMs: 60000,
          max: 100,
        },
        compression: true,
      },
      database: {
        type: "postgresql",
        host: "db-cluster.aws.com",
        port: 5432,
        database: "myapp_prod",
        username: "prod_user",
        poolSize: 50,
        ssl: true,
        replication: {
          read: ["read-replica-1.aws.com", "read-replica-2.aws.com"],
          write: "primary.aws.com",
        },
        backup: {
          enabled: true,
          schedule: "0 2 * * *",
        },
      },
      redis: {
        host: "redis-cluster.aws.com",
        port: 6379,
        db: 0,
        password: "REDIS_PASSWORD",
        cluster: true,
        sentinels: [
          { host: "sentinel-1.aws.com", port: 26379 },
          { host: "sentinel-2.aws.com", port: 26379 },
        ],
      },
      auth: {
        jwtSecret: "PRODUCTION_JWT_SECRET",
        sessionTimeout: 7200,
        refreshTokenExpiry: 2592000,
        providers: ["local", "google", "github", "microsoft"],
        oauth: {
          google: {
            clientId: "GOOGLE_CLIENT_ID",
            clientSecret: "GOOGLE_CLIENT_SECRET",
          },
          github: {
            clientId: "GITHUB_CLIENT_ID",
            clientSecret: "GITHUB_CLIENT_SECRET",
          },
        },
        mfa: {
          enabled: true,
          issuer: "MyApp",
        },
      },
      storage: {
        type: "s3",
        bucket: "myapp-uploads",
        region: "us-east-1",
        accessKeyId: "AWS_ACCESS_KEY",
        secretAccessKey: "AWS_SECRET_KEY",
        maxFileSize: 52428800,
        cloudfront: "https://d1234567.cloudfront.net",
      },
      email: {
        provider: "sendgrid",
        apiKey: "SENDGRID_API_KEY",
        from: "noreply@myapp.com",
        templates: {
          welcome: "tmpl_welcome_v2",
          passwordReset: "tmpl_password_reset_v2",
          verification: "tmpl_verification_v2",
        },
      },
      monitoring: {
        sentry: {
          enabled: true,
          dsn: "https://sentry.io/myapp",
          environment: "production",
        },
        datadog: {
          enabled: true,
          apiKey: "DATADOG_API_KEY",
          appKey: "DATADOG_APP_KEY",
        },
      },
      features: {
        payments: true,
        subscriptions: true,
        analytics: true,
        aiAssistant: true,
        advancedSearch: true,
      },
    },
  },
  largeDataset: {
    name: "Large Dataset",
    description: "Performance test with extensive data",
    old: {
      analytics: {
        dailyStats: Array.from({ length: 30 }, (_, i) => ({
          date: `2024-11-${String(i + 1).padStart(2, "0")}`,
          visitors: Math.floor(Math.random() * 1000) + 500,
          pageViews: Math.floor(Math.random() * 5000) + 2000,
          bounceRate: (Math.random() * 30 + 20).toFixed(2),
          avgSessionDuration: Math.floor(Math.random() * 300) + 60,
          conversions: Math.floor(Math.random() * 50) + 10,
          revenue: (Math.random() * 10000 + 1000).toFixed(2),
          newUsers: Math.floor(Math.random() * 300) + 100,
          returningUsers: Math.floor(Math.random() * 700) + 200,
          sources: {
            organic: Math.floor(Math.random() * 400) + 100,
            direct: Math.floor(Math.random() * 300) + 100,
            social: Math.floor(Math.random() * 200) + 50,
            referral: Math.floor(Math.random() * 100) + 20,
            paid: Math.floor(Math.random() * 150) + 30,
          },
          devices: {
            mobile: Math.floor(Math.random() * 600) + 200,
            desktop: Math.floor(Math.random() * 400) + 200,
            tablet: Math.floor(Math.random() * 100) + 50,
          },
          topPages: [
            { path: "/home", views: Math.floor(Math.random() * 1000) + 500 },
            { path: "/products", views: Math.floor(Math.random() * 800) + 300 },
            { path: "/about", views: Math.floor(Math.random() * 500) + 100 },
            { path: "/contact", views: Math.floor(Math.random() * 300) + 50 },
            { path: "/blog", views: Math.floor(Math.random() * 400) + 100 },
          ],
        })),
        features: Array.from({ length: 50 }, (_, i) => ({
          id: `feature_${i + 1}`,
          name: `Feature ${i + 1}`,
          enabled: Math.random() > 0.3,
          rolloutPercentage: Math.floor(Math.random() * 100),
        })),
      },
    },
    new: {
      analytics: {
        dailyStats: Array.from({ length: 30 }, (_, i) => ({
          date: `2024-12-${String(i + 1).padStart(2, "0")}`,
          visitors: Math.floor(Math.random() * 1500) + 700,
          pageViews: Math.floor(Math.random() * 7000) + 3000,
          bounceRate: (Math.random() * 25 + 15).toFixed(2),
          avgSessionDuration: Math.floor(Math.random() * 400) + 120,
          conversions: Math.floor(Math.random() * 80) + 20,
          revenue: (Math.random() * 15000 + 2000).toFixed(2),
          newUsers: Math.floor(Math.random() * 400) + 150,
          returningUsers: Math.floor(Math.random() * 1100) + 350,
          sources: {
            organic: Math.floor(Math.random() * 600) + 200,
            direct: Math.floor(Math.random() * 400) + 150,
            social: Math.floor(Math.random() * 350) + 100,
            referral: Math.floor(Math.random() * 150) + 40,
            paid: Math.floor(Math.random() * 250) + 60,
            email: Math.floor(Math.random() * 200) + 50,
          },
          devices: {
            mobile: Math.floor(Math.random() * 800) + 400,
            desktop: Math.floor(Math.random() * 500) + 250,
            tablet: Math.floor(Math.random() * 150) + 75,
            smartTv: Math.floor(Math.random() * 50) + 10,
          },
          topPages: [
            {
              path: "/home",
              views: Math.floor(Math.random() * 1500) + 700,
              avgTime: 145,
            },
            {
              path: "/products",
              views: Math.floor(Math.random() * 1200) + 500,
              avgTime: 230,
            },
            {
              path: "/checkout",
              views: Math.floor(Math.random() * 600) + 200,
              avgTime: 180,
            },
            {
              path: "/about",
              views: Math.floor(Math.random() * 700) + 200,
              avgTime: 90,
            },
            {
              path: "/contact",
              views: Math.floor(Math.random() * 400) + 100,
              avgTime: 120,
            },
            {
              path: "/blog",
              views: Math.floor(Math.random() * 600) + 200,
              avgTime: 310,
            },
            {
              path: "/dashboard",
              views: Math.floor(Math.random() * 800) + 300,
              avgTime: 420,
            },
          ],
          performance: {
            avgLoadTime: (Math.random() * 2 + 1).toFixed(2),
            errorRate: (Math.random() * 2).toFixed(2),
            serverResponseTime: Math.floor(Math.random() * 200) + 50,
          },
        })),
        features: Array.from({ length: 65 }, (_, i) => ({
          id: `feature_${i + 1}`,
          name: `Feature ${i + 1}`,
          enabled: Math.random() > 0.25,
          rolloutPercentage: Math.floor(Math.random() * 100),
          targeting:
            i > 30
              ? { countries: ["US", "CA", "UK"], minVersion: "2.0.0" }
              : undefined,
        })),
      },
    },
  },
};

type MockDataKey = keyof typeof mockDataSets;
type SettingsTab = "data" | "theme";

export function DiffThemeShowcase() {
  const [selectedData, setSelectedData] = useState<MockDataKey>("userProfile");
  // Default options matching VS Code and Git standards
  const [options] = useState<DiffOptions>({
    hideLineNumbers: false, // Line numbers enabled by default (VS Code/Git standard)
    disableWordDiff: false, // Word diff enabled by default (Git standard)
    showDiffOnly: false, // Always show full context, never diff-only
    compareMethod: "words", // Git's default word-based diff
    contextLines: 3,
    lineOffset: 0,
  });
  const [selectedTheme, setSelectedTheme] =
    useState<DiffThemeKey>("gitClassic");
  const [viewMode, setViewMode] = useState<"themed" | "standalone">("themed");
  const [settingsTab, setSettingsTab] = useState<SettingsTab>("data");

  const currentMockData = mockDataSets[selectedData];

  return (
    <View style={styles.container}>
      {/* Fixed Header */}
      <View style={styles.fixedHeader}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Diff Viewer</Text>
          <Text style={styles.subtitle}>VS Code Quality Comparison</Text>
        </View>

        {/* View Mode Selector */}
        <View style={styles.viewModeContainer}>
          {(["themed", "standalone"] as const).map((mode) => (
            <TouchableOpacity
              key={mode}
              style={[
                styles.viewModeBtn,
                viewMode === mode && styles.viewModeBtnActive,
              ]}
              onPress={() => setViewMode(mode)}
            >
              <Text
                style={[
                  styles.viewModeBtnText,
                  viewMode === mode && styles.viewModeBtnTextActive,
                ]}
              >
                {mode === "themed" ? "Themed" : "Standalone"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Settings Tabs */}
        <View style={styles.settingsTabs}>
          {(["data", "theme"] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.settingsTab,
                settingsTab === tab && styles.settingsTabActive,
              ]}
              onPress={() => setSettingsTab(tab)}
            >
              <Text
                style={[
                  styles.settingsTabText,
                  settingsTab === tab && styles.settingsTabTextActive,
                ]}
              >
                {tab.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Settings Content */}
        <View style={styles.settingsContent}>
          {settingsTab === "data" && (
            <View style={styles.settingsPanel}>
              <Text style={styles.settingsPanelDesc}>
                {currentMockData.description}
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.optionRow}>
                  {(Object.keys(mockDataSets) as MockDataKey[]).map((key) => (
                    <TouchableOpacity
                      key={key}
                      style={[
                        styles.optionBtn,
                        selectedData === key && styles.optionBtnActive,
                      ]}
                      onPress={() => setSelectedData(key)}
                    >
                      <Text
                        style={[
                          styles.optionBtnText,
                          selectedData === key && styles.optionBtnTextActive,
                        ]}
                      >
                        {mockDataSets[key].name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}

          {settingsTab === "theme" && viewMode === "themed" && (
            <View style={styles.settingsPanel}>
              <Text style={styles.settingsPanelDesc}>Choose visual style</Text>
              <View style={styles.optionRow}>
                {(Object.keys(diffThemes) as DiffThemeKey[]).map((key) => (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.optionBtn,
                      selectedTheme === key && styles.optionBtnActive,
                    ]}
                    onPress={() => setSelectedTheme(key)}
                  >
                    <Text
                      style={[
                        styles.optionBtnText,
                        selectedTheme === key && styles.optionBtnTextActive,
                      ]}
                    >
                      {key === "gitClassic" ? "Git" : "Dev Tools"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {settingsTab === "theme" && viewMode !== "themed" && (
            <View style={styles.settingsPanel}>
              <Text style={styles.settingsPanelDesc}>
                Theme selection only available in Themed mode
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Scrollable Diff Viewer */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {viewMode === "themed" ? (
          <ThemedSplitView
            key={`themed-${selectedData}`}
            oldValue={currentMockData.old}
            newValue={currentMockData.new}
            differences={[]}
            theme={diffThemes[selectedTheme]}
            options={options}
            showThemeName={true}
          />
        ) : (
          <StandaloneDiffViewer
            key={`standalone-${selectedData}`}
            oldValue={currentMockData.old}
            newValue={currentMockData.new}
            theme={selectedTheme === "gitClassic" ? "git" : "default"}
            height={500}
            showOptions={false}
            options={options}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: gameUIColors.background,
  },
  fixedHeader: {
    backgroundColor: gameUIColors.panel,
    borderBottomWidth: 1,
    borderBottomColor: gameUIColors.border,
    paddingBottom: 12,
  },
  titleContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: gameUIColors.primary,
    fontFamily: "monospace",
  },
  subtitle: {
    fontSize: 11,
    color: gameUIColors.muted,
    fontFamily: "monospace",
    marginTop: 2,
  },
  viewModeContainer: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: gameUIColors.background,
    borderRadius: 6,
    padding: 3,
  },
  viewModeBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 4,
    alignItems: "center",
  },
  viewModeBtnActive: {
    backgroundColor: gameUIColors.primary + "20",
  },
  viewModeBtnText: {
    fontSize: 11,
    color: gameUIColors.muted,
    fontFamily: "monospace",
    fontWeight: "600",
  },
  viewModeBtnTextActive: {
    color: gameUIColors.primary,
  },
  settingsTabs: {
    flexDirection: "row",
    marginHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: gameUIColors.border + "30",
  },
  settingsTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
  },
  settingsTabActive: {
    borderBottomWidth: 2,
    borderBottomColor: gameUIColors.info,
  },
  settingsTabText: {
    fontSize: 10,
    color: gameUIColors.muted,
    fontFamily: "monospace",
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  settingsTabTextActive: {
    color: gameUIColors.info,
  },
  settingsContent: {
    minHeight: 80,
  },
  settingsPanel: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  settingsPanelDesc: {
    fontSize: 10,
    color: gameUIColors.primaryLight,
    fontFamily: "monospace",
    marginBottom: 8,
    fontStyle: "italic",
  },
  optionRow: {
    flexDirection: "row",
    gap: 8,
  },
  optionBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: gameUIColors.background,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: gameUIColors.border,
  },
  optionBtnActive: {
    backgroundColor: gameUIColors.info + "20",
    borderColor: gameUIColors.info,
  },
  optionBtnText: {
    fontSize: 11,
    color: gameUIColors.muted,
    fontFamily: "monospace",
  },
  optionBtnTextActive: {
    color: gameUIColors.info,
  },
  displayOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  displayOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  displayOptionLabel: {
    fontSize: 11,
    color: gameUIColors.primaryLight,
    fontFamily: "monospace",
  },
  displayOptionStatus: {
    fontSize: 11,
    color: gameUIColors.success,
    fontFamily: "monospace",
  },
  contextLines: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    width: "100%",
  },
  contextLinesLabel: {
    fontSize: 11,
    color: gameUIColors.primaryLight,
    fontFamily: "monospace",
  },
  contextBtn: {
    width: 28,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: gameUIColors.background,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: gameUIColors.border,
  },
  contextBtnActive: {
    backgroundColor: gameUIColors.success + "20",
    borderColor: gameUIColors.success,
  },
  contextBtnText: {
    fontSize: 10,
    color: gameUIColors.muted,
    fontFamily: "monospace",
  },
  contextBtnTextActive: {
    color: gameUIColors.success,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
});
