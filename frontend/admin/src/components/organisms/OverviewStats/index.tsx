import { Card, Statistic } from 'antd';

interface Stat {
  title: string;
  value: string;
  color: string;
  icon?: React.ReactNode;
}
export const OverViewStats = ({ stats }: { stats: Stat[] }) => {
  return (
    <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
      {stats.map((stat) => (
        <Card key={stat.title} variant='borderless'>
          <Statistic
            title={stat.title}
            value={stat.value}
            prefix={stat.icon}
            valueStyle={{ color: stat.color }}
          />
        </Card>
      ))}
    </div>
  );
};
