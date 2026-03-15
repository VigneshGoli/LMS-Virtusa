interface LoadingSkeletonProps {
  rows?: number
}

const LoadingSkeleton = ({ rows = 3 }: LoadingSkeletonProps) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, idx) => (
        <div
          // eslint-disable-next-line react/no-array-index-key
          key={idx}
          className="h-16 animate-pulse rounded-2xl bg-slate-200/80"
        />
      ))}
    </div>
  )
}

export default LoadingSkeleton

