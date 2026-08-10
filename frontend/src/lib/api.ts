const API_BASE = 'http://localhost:8080/api'; // Or wherever the Spring Boot app is running

export const fetchParties = async () => {
  const response = await fetch(`${API_BASE}/v1/parties`);
  if (!response.ok) throw new Error('Failed to fetch parties');
  return response.json();
};

export const fetchProjectsByPartyId = async (partyId: string) => {
  const response = await fetch(`${API_BASE}/v1/projects?partyId=${partyId}`);
  if (!response.ok) throw new Error('Failed to fetch projects');
  return response.json();
};

export const fetchProfileSystems = async () => {
  const response = await fetch(`${API_BASE}/v1/profile-systems`);
  if (!response.ok) throw new Error('Failed to fetch profile systems');
  return response.json();
};

export const generateAutoDesign = async (data: any) => {
  const response = await fetch(`${API_BASE}/designs/auto-generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to generate design');
  return response.json();
};
