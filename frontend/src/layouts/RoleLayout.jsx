function RoleLayout({ children }) {
  return (
    <div>
      <header style={{ backgroundColor: '#f0f0f0', padding: '10px' }}>
        <h1>Hospital App</h1>
      </header>
      <main style={{ padding: '20px' }}>{children}</main>
    </div>
  );
}
export default RoleLayout;
