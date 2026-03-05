import React from "react";
import { useGetDashboardStats } from "@/hooks/queries/useVideoQuerries";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Film,
  Users,
  Layers,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
} from "lucide-react";
import { UPLOAD_STATUS } from "@/types/Videos";

// ─── Helpers ────────────────────────────────────────────────────────────────────

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));

const processingStatusBadge = (status: UPLOAD_STATUS) => {
  switch (status) {
    case UPLOAD_STATUS.COMPLETED:
      return (
        <Badge className="bg-green-600/80 text-white border-0 capitalize">
          {status}
        </Badge>
      );
    case UPLOAD_STATUS.PROCESSING:
      return (
        <Badge variant="secondary" className="capitalize">
          {status}
        </Badge>
      );
    case UPLOAD_STATUS.PENDING:
      return (
        <Badge variant="outline" className="capitalize">
          {status}
        </Badge>
      );
    case UPLOAD_STATUS.FAILED:
      return (
        <Badge variant="destructive" className="capitalize">
          {status}
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="capitalize">
          {status}
        </Badge>
      );
  }
};

// ─── Stat Card ───────────────────────────────────────────────────────────────────

interface StatCardProps {
  title: string;
  value: number | string;
  description?: string;
  icon: React.ReactNode;
  accent?: string;
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon,
  accent = "text-primary",
  loading = false,
}) => (
  <Card className="border-border">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground font-body">
        {title}
      </CardTitle>
      <div className={accent}>{icon}</div>
    </CardHeader>
    <CardContent>
      {loading ? (
        <Skeleton className="h-8 w-24" />
      ) : (
        <div className="text-3xl font-heading text-primary">{value}</div>
      )}
      {description && (
        <p className="text-xs text-muted-foreground mt-1 font-body">
          {description}
        </p>
      )}
    </CardContent>
  </Card>
);

// ─── Dashboard ───────────────────────────────────────────────────────────────────

const Dashboard: React.FC = () => {
  const { data: stats, isPending, isError, error } = useGetDashboardStats();

  const today = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

  const total = stats?.videos.total ?? 0;
  const completedPct =
    total > 0 ? Math.round(((stats?.videos.completed ?? 0) / total) * 100) : 0;
  const processingPct =
    total > 0 ? Math.round(((stats?.videos.processing ?? 0) / total) * 100) : 0;
  const pendingPct =
    total > 0 ? Math.round(((stats?.videos.pending ?? 0) / total) * 100) : 0;
  const failedPct =
    total > 0 ? Math.round(((stats?.videos.failed ?? 0) / total) * 100) : 0;

  return (
    <div className="flex flex-col gap-6 p-4 pt-2 text-primary">
      {/* ── Page Header ── */}
      <div className="flex flex-col gap-0.5">
        <h1 className="text-3xl font-heading text-primary">Dashboard</h1>
        <p className="text-sm text-muted-foreground font-body">{today}</p>
      </div>

      {isError && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive font-body">
          {error.message}
        </div>
      )}

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <StatCard
          title="Total Videos"
          value={stats?.videos.total ?? 0}
          icon={<Film size={18} />}
          accent="text-primary"
          loading={isPending}
        />
        <StatCard
          title="Completed"
          value={stats?.videos.completed ?? 0}
          icon={<CheckCircle2 size={18} />}
          accent="text-green-500"
          loading={isPending}
        />
        <StatCard
          title="Processing"
          value={stats?.videos.processing ?? 0}
          description="currently encoding"
          icon={<TrendingUp size={18} />}
          accent="text-blue-400"
          loading={isPending}
        />
        <StatCard
          title="Pending"
          value={stats?.videos.pending ?? 0}
          description="awaiting processing"
          icon={<Clock size={18} />}
          accent="text-yellow-400"
          loading={isPending}
        />
        <StatCard
          title="Failed"
          value={stats?.videos.failed ?? 0}
          icon={<XCircle size={18} />}
          accent="text-destructive"
          loading={isPending}
        />
        <StatCard
          title="Users"
          value={stats?.users.total ?? 0}
          icon={<Users size={18} />}
          loading={isPending}
        />
      </div>

      {/* ── Second Row: Categories + Status Distribution ── */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Categories card */}
        <Card className="border-border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground font-body">
                Categories
              </CardTitle>
              <Layers size={18} className="text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            {isPending ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-3xl font-heading text-primary">
                {stats?.categories.total ?? 0}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1 font-body">
              total content categories
            </p>
          </CardContent>
        </Card>

        {/* Upload status distribution */}
        <Card className="border-border md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground font-body">
              Upload Status Distribution
            </CardTitle>
            <CardDescription className="font-body text-xs">
              Breakdown of all {total} video(s) by processing state
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {isPending ? (
              <>
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-5 w-full" />
                ))}
              </>
            ) : (
              <>
                <StatusRow
                  label="Completed"
                  value={stats?.videos.completed ?? 0}
                  pct={completedPct}
                  barClass="bg-green-500"
                />
                <StatusRow
                  label="Processing"
                  value={stats?.videos.processing ?? 0}
                  pct={processingPct}
                  barClass="bg-blue-400"
                />
                <StatusRow
                  label="Pending"
                  value={stats?.videos.pending ?? 0}
                  pct={pendingPct}
                  barClass="bg-yellow-400"
                />
                <StatusRow
                  label="Failed"
                  value={stats?.videos.failed ?? 0}
                  pct={failedPct}
                  barClass="bg-destructive"
                />
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Recent Videos Table ── */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="font-heading text-xl text-primary">
            Recent Uploads
          </CardTitle>
          <CardDescription className="font-body text-sm text-muted-foreground">
            Latest 6 videos uploaded to the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isPending ? (
            <div className="flex flex-col gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="font-body text-muted-foreground">
                    Title
                  </TableHead>
                  <TableHead className="font-body text-muted-foreground">
                    Category
                  </TableHead>
                  <TableHead className="font-body text-muted-foreground">
                    Uploaded by
                  </TableHead>
                  <TableHead className="font-body text-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead className="font-body text-muted-foreground text-right">
                    Date
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats?.recentVideos.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground font-body py-8"
                    >
                      No videos uploaded yet.
                    </TableCell>
                  </TableRow>
                )}
                {stats?.recentVideos.map((video) => (
                  <TableRow
                    key={video.id}
                    className="border-border hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="font-body font-medium text-primary max-w-[180px] truncate">
                      {video.title}
                    </TableCell>
                    <TableCell className="font-body text-muted-foreground text-sm">
                      {video.category?.name ?? (
                        <span className="italic">Uncategorized</span>
                      )}
                    </TableCell>
                    <TableCell className="font-body text-sm text-muted-foreground">
                      {video.uploadedBy.username}
                    </TableCell>
                    <TableCell>
                      {processingStatusBadge(video.processingStatus)}
                    </TableCell>
                    <TableCell className="font-body text-sm text-muted-foreground text-right">
                      {formatDate(video.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// ─── Status Row helper ───────────────────────────────────────────────────────────

interface StatusRowProps {
  label: string;
  value: number;
  pct: number;
  barClass: string;
}

const StatusRow: React.FC<StatusRowProps> = ({
  label,
  value,
  pct,
  barClass,
}) => (
  <div className="flex flex-col gap-1">
    <div className="flex items-center justify-between text-xs font-body">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-primary font-medium">
        {value} <span className="text-muted-foreground">({pct}%)</span>
      </span>
    </div>
    <Progress
      value={pct}
      className="h-2 bg-muted"
      indicatorClassName={barClass}
    />
  </div>
);

export default Dashboard;
