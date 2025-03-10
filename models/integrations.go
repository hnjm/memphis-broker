// Copyright 2022-2023 The Memphis.dev Authors
// Licensed under the Memphis Business Source License 1.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// Changed License: [Apache License, Version 2.0 (https://www.apache.org/licenses/LICENSE-2.0), as published by the Apache Foundation.
//
// https://github.com/memphisdev/memphis-broker/blob/master/LICENSE
//
// Additional Use Grant: You may make use of the Licensed Work (i) only as part of your own product or service, provided it is not a message broker or a message queue product or service; and (ii) provided that you do not use, provide, distribute, or make available the Licensed Work as a Service.
// A "Service" is a commercial offering, product, hosted, or managed service, that allows third parties (other than your own employees and contractors acting on your behalf) to access and/or use the Licensed Work or a substantial set of the features or functionality of the Licensed Work to third parties as a software-as-a-service, platform-as-a-service, infrastructure-as-a-service or other similar services that compete with Licensor products or services.
package models

import (
	"github.com/slack-go/slack"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Integration struct {
	ID         primitive.ObjectID `json:"id" bson:"_id"`
	Name       string             `json:"name" bson:"name"`
	Keys       map[string]string  `json:"keys" bson:"keys"`
	Properties map[string]bool    `json:"properties" bson:"properties"`
}

type SlackIntegration struct {
	Name       string            `json:"name"`
	Keys       map[string]string `json:"keys"`
	Properties map[string]bool   `json:"properties"`
	Client     *slack.Client     `json:"client"`
}

type CreateIntegrationSchema struct {
	Name       string            `json:"name"`
	Keys       map[string]string `json:"keys"`
	Properties map[string]bool   `json:"properties"`
	UIUrl      string            `json:"ui_url" bson:"ui_url"`
}

type GetIntegrationDetailsSchema struct {
	Name string `form:"name" json:"name" binding:"required"`
}

type DisconnectIntegrationSchema struct {
	Name string `form:"name" json:"name" binding:"required"`
}

type Notification struct {
	Title string `json:"title" binding:"required"`
	Msg   string `json:"msg" binding:"required"`
	Type  string `json:"type" binding:"required"`
	Code  string `json:"code"`
}

type RequestIntegrationSchema struct {
	RequestContent string `json:"request_content"`
}
