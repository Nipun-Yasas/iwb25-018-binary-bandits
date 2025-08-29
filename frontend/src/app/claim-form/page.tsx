'use client';

import { useState } from 'react';

interface ClaimFormData {
  patientId: string;
  providerId: string;
  policyId: string;
  diagnosisCode: string;
  diagnosisDisplay: string;
  procedureCode: string;
  procedureDisplay: string;
  claimAmount: string;
}

interface ClaimResponse {
  success: boolean;
  message: string;
  claimResponse?: {
    resourceType: string;
    id: string;
    outcome: string;
    status: string;
    disposition: string;
    payment: {
      amount: {
        value: number;
        currency: string;
      };
    };
  };
}

export default function ClaimForm() {
  const [formData, setFormData] = useState<ClaimFormData>({
    patientId: '',
    providerId: '',
    policyId: '',
    diagnosisCode: '',
    diagnosisDisplay: '',
    procedureCode: '',
    procedureDisplay: '',
    claimAmount: ''
  });

  const [response, setResponse] = useState<ClaimResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateClaimId = () => {
    return 'CLM-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResponse(null);

    try {
      const claimId = generateClaimId();
      
      const claim = {
        resourceType: "Claim",
        id: '212',
        patient: {
          reference: `Patient/${formData.patientId}`
        },
        insurer: {
          reference: "Organization/INS001"
        },
        provider: {
          reference: `Organization/${formData.providerId}`
        },
        insurance: [
          {
            sequence: 1,
            focal: true,
            coverage: {
              reference: `Coverage/${formData.policyId}`
            }
          }
        ],
        diagnosis: [
          {
            sequence: 1,
            diagnosisCodeableConcept: {
              coding: [
                {
                  code: formData.diagnosisCode,
                  display: formData.diagnosisDisplay
                }
              ]
            }
          }
        ],
        item: [
          {
            sequence: 1,
            productOrService: {
              coding: [
                {
                  code: formData.procedureCode,
                  display: formData.procedureDisplay
                }
              ]
            },
            unitPrice: {
              value: parseFloat(formData.claimAmount),
              currency: "USD"
            }
          }
        ],
        total: {
          value: parseFloat(formData.claimAmount),
          currency: "USD"
        }
      };

      const apiResponse = await fetch('http://localhost:8080/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(claim)
      });

      const result = await apiResponse.json();
      setResponse(result);

    } catch (error) {
      setResponse({
        success: false,
        message: 'Failed to submit claim: ' + (error as Error).message
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Submit Insurance Claim</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patient ID
                </label>
                <input
                  type="text"
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 12345"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Provider ID
                </label>
                <input
                  type="text"
                  name="providerId"
                  value={formData.providerId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., PROV001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Policy ID
                </label>
                <input
                  type="text"
                  name="policyId"
                  value={formData.policyId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., POL123456"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Claim Amount ($)
                </label>
                <input
                  type="number"
                  name="claimAmount"
                  value={formData.claimAmount}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 1500.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Diagnosis Code
                </label>
                <input
                  type="text"
                  name="diagnosisCode"
                  value={formData.diagnosisCode}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., K21.9"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Diagnosis Description
                </label>
                <input
                  type="text"
                  name="diagnosisDisplay"
                  value={formData.diagnosisDisplay}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Gastro-esophageal reflux disease"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Procedure Code
                </label>
                <input
                  type="text"
                  name="procedureCode"
                  value={formData.procedureCode}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 99213"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Procedure Description
                </label>
                <input
                  type="text"
                  name="procedureDisplay"
                  value={formData.procedureDisplay}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Office visit, established patient"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting Claim...' : 'Submit Claim'}
            </button>
          </form>

          {response && (
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Claim Response</h2>
              
              <div className={`p-4 rounded-md mb-4 ${
                response.success ? 'bg-green-100 border border-green-400' : 'bg-red-100 border border-red-400'
              }`}>
                <p className={`font-medium ${response.success ? 'text-green-800' : 'text-red-800'}`}>
                  {response.success ? '✅ Success' : '❌ Error'}
                </p>
                <p className={response.success ? 'text-green-700' : 'text-red-700'}>
                  {response.message}
                </p>
              </div>

              {response.success && response.claimResponse && (
                <div className="bg-white p-4 rounded-md border">
                  <h3 className="font-semibold text-gray-900 mb-3">Claim Processing Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Response ID:</span>
                      <p className="text-gray-900">{response.claimResponse.id}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Status:</span>
                      <p className="text-gray-900">{response.claimResponse.status}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Outcome:</span>
                      <p className="text-gray-900">{response.claimResponse.outcome}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Payment Amount:</span>
                      <p className="text-gray-900">
                        ${response.claimResponse.payment.amount.value} {response.claimResponse.payment.amount.currency}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <span className="font-medium text-gray-600">Disposition:</span>
                      <p className="text-gray-900">{response.claimResponse.disposition}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
