import { Bar, Foot } from '../parts';
import { SideNav } from './SideNav';
import './docs.css';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Bar active="docs" />
      <div className="dl">
        <SideNav />
        {children}
      </div>
      <Foot />
    </>
  );
}
